var Datalog = (
    function() {
        function range(begin, end) {
            for (var i=begin; i<end; i++) {
                yield i;
            }
        }


        function parse_query(s, mod) {
            var result = DatalogLexer.tokenize(s);

            if (!result[0]) {
                return result;
            }

            var ast = DatalogParser.parse_query(result[1]);
            if (ast === false) {
                return [false, "syntax error in query"];
            }

            return [true, [ [n, [(m||mod) ,f], a] for each ([n, m, f, a] in ast)] ];
        }


        function parse_clauses(s, mod) {
            if (s === "") {
                return [true, []];
            }

            var result = DatalogLexer.tokenize(s);

            if (!result[0]) {
                return result;
            }

            if (result[1].length === 1) {
                return [true, []];
            }

            var ast = DatalogParser.parse_clauses(result[1]);
            if (ast === false) {
                return [false, "syntax error in rules"];
            }

            return [
                true,
                [[head, [[n, [(m||mod),f], a] for each ([n, m, f, a] in body)] ]
                 for each ([head, body] in ast)]
                                              ];
        }


        function build_db(s, mod) {
            var clauses = parse_clauses(s, mod);

            if (!clauses[0]) {
                return false;
            }

            var db = {};

            for each (let [head, body] in clauses[1]) {
                var [p, a] = head;
                var entry = db[p] || [];

                entry.push(
                    ["rule",
                     a,
                     [ [x, y] for each ([pos, x, y] in body) if (pos === true)],
                              [ [x, y] for each ([pos, x, y] in body) if (pos === false)]
                              ]);

                db[p] = entry;
            }

            return db;
        }

        function is_var(v) {
            return ((Array.isArray(v)) &&
                    (v.length === 2) &&
                    (v[0] === "var"));
        }

        function reified(v) {
            if (is_var(v)) {
                if (typeof(v[1]) == 'number') {
                    return true;
                }
            }

            return false;
        }

        function is_equal_value(a,b) {
            if (Array.isArray(a)) {
                if (Array.isArray(b)) {
                    return ((a[0] === b[0]) && (a[1] === b[1]));
                } else {
                    return false;
                }
            } else {
                if (!Array.isArray(b)) {
                    return (a===b);
                } else {
                    return false;
                }
            }
        }

        function is_same_goal(a, b) {
            if (!is_equal_value(a[0], b[0])) {
                return false;
            }

            if (a[1].length !== b[1].length) {
                return false;
            }

            for(var i=0; i<a[1].length; i++) {
                if (!is_equal_value(a[1][i], b[1][i])) {
                    return false;
                }
            }

            return true;
        }

        function is_goal_in_list(goal, list) {
            for each (var g in list) {
                if (is_same_goal(g, goal)) {
                    return true;
                }
            }

            return false;
        }


        var nil = {
            subst: function(key) {
                while (is_var(key)) {
                    var found = false;

                    for(var s=this; s!==nil; s=s.__proto__) {
                        if (s.key[1] === key[1]) {
                            key = s.value;
                            found = true;
                            break;
                        }
                    }

                    if(!found) {
                        break;
                    }
                }

                return key;
            },

            ext: function(key, value) {
                var v = this.subst(value);

                if (is_var(v)) {
                    if (key[1] === v[1]) {
                        return false;
                    }
                }

                return { __proto__: this, key: key, value: v};
            },

            exts: function(list) {
                return list.reduce(
                    function (s, e){
                        var [k,v] = e;
                        return s.ext(k, v);
                    }, this);
            },

            walk: function(vs) {
                return [this.subst(v) for each (v in vs)];
            },

            unify: function(v1, v2) {
                v1 = this.subst(v1);
                v2 = this.subst(v2);

                if (is_var(v1)) {
                    if ((is_var(v2)) && (v1[1] === v2[1])) {
                        return this;
                    }

                    return this.ext(v1, v2);
                }

                if (is_var(v2)) {
                    return this.ext(v2, v1);
                }

                if (is_equal_value(v1, v2)) {
                    return this;
                }

                return false;
            },


            keys: function() {
                for(var s=this; s!==nil; s=s.__proto__) {
                    yield s.key;
                }
            },

            values: function() {
                for(var s=this; s!==nil; s=s.__proto__) {
                    yield s.value;
                }
            },

            items: function() {
                for(var s=this; s!==nil; s=s.__proto__) {
                    yield [s.key, s.value];
                }
            },


            toDict: function() {
                var d = {};

                    for(var s=this; s!==nil; s=s.__proto__) {
                        d[s.key[1]] = s.value;
                    }

                return d;
            },

            toString: function() {
                return JSON.stringify(this.toDict());
            }
        };

        function unify_list(a, b) {
            if (a.length !== b.length) {
                return false;
            }

            var s = nil;

            for (var i=0; i<a.length; i++) {
                s = s.unify(a[i], b[i]);

                if (s === false) {
                    return false;
                }
            }

            return s;
        }


        function reify(vs, s, c) {
            if ((s === undefined) && (c === undefined)) {
                s = nil;
                c = 0;
            }

            var res = [];

            for (var i=0; i<vs.length; i++) {
                var value = s.subst(vs[i]);

                if ((!is_var(value)) || reified(value)) {
                    res.push(value);
                    continue;
                }

                var g = ["var", c];
                res.push(g);
                s = s.ext(value, g);
                c += 1;
            }

            return [res, s, c];
        }

        // key: [[m, f], a]
        function Table() {
            this.data = [];
        }

        Table.prototype.find = function(key) {
            for each (var entry in this.data) {
                var [k,v] = entry;

                if (!is_same_goal(k, key)) {
                    continue;
                }

                if (!is_equal_value(k[0], key[0])) {
                    continue;
                }

                return entry;
            }

            return undefined;
        };

        Table.prototype.get = function(key) {
            var entry = this.find(key);
            if (!entry) {
                return undefined;
            }

            var [k,v] = entry;
            return v;
        };


        Table.prototype.put = function(key, value) {
            var entry = this.find(key);
            if (!entry) {
                this.data.push([key, value]);
            } else {
                entry[1] = value;
            }
        };


        function subst_of(answer) {
            return nil.exts([ [["var", i], answer[i]] for each (i in range(0, answer.length))]);
        }


        function query(goals, db) {
            var posgoals = [[x,y] for each ([pos,x,y] in goals) if (pos === true)];
            var neggoals = [[x,y] for each ([pos,x,y] in goals) if (pos === false)];

            var s = nil;
            var c = 0;

            for (var i=0; i<posgoals.length; i++) {
                [res, s, c] = reify(posgoals[i][1], s, c);
            }

            var r = nil.exts([[v,k] for each([k, v] in s.items())]);
            var a = [["var", i] for each (i in range(0, c))];

            var table = new Table();
            table.put(["root", a], [[], [], [], false]);

            cont(
                [ [ [ ["rule", [ r.subst(x) for each (x in a)], posgoals, neggoals ] ], "root", a] ],
                table,
                db);

            var [answers, _, _, _] = table.get(["root", a]);

            var res = [];

            for each (var answer in answers) {
                res.push(
                    nil.exts(
                        [[k, subst_of(answer).subst(v)]
                         for each ([k,v] in s.items())])
                );
            }

            return res;

        }

        function success(parent, s, posgoals, neggoals, waitings, stack, table, db) {
            if (posgoals.length > 0) {
                var [p,a] = posgoals[0];
                var a1 = s.walk(a);
                var [a2, r, _] = reify(a1);
                poslookup([p, a2], [parent, s, r, posgoals.slice(1), neggoals], waitings, stack, table, db);
            } else if (neggoals.length > 0) {
                var reifiedgoals = [];
                var goals = [];

                for each (var [p,a] in neggoals) {
                    var a1 = s.walk(a);
                    var [a2, _, _] = reify(a1);
                    reifiedgoals.push([p, a2]);
                    goals.push([[p,a2], [p,a]]);
                }

                for each (var g in reifiedgoals) {
                    neglookup(g, [parent, s, goals], waitings, stack, table, db);
                }
            } else {
                var [goal, subst] = parent;

                var items = [[k, s.subst(v)] for each ([k,v] in subst.items())];
                var s1 = nil.exts(items);
                var answer = [ s1.subst(["var", i]) for each (i in range(0, items.length))];

                var [answers, poslookups, neglookups, completed] = table.get(goal);

                var existed = false;

                for each(var a in answers) {
                    var match = true;

                    for(var i=0; i<answer.length; i++) {
                        if (!is_equal_value(a[i], answer[i])) {
                            match = false;
                            break;
                        }
                    }

                    if(match === true) {
                        existed = true;
                        break;
                    }
                }

                if(existed === false) {
                    answers.push(answer);

                    for each (var frame in poslookups) {
                        waitings.push([answer, frame]);
                    }
                }
            }
        }

        function poslookup(goal, frame, waitings, stack, table, db) {
            var [p,a] = goal;
            var entry = table.get(goal);

            if (entry !== undefined) {
                var [answers, poslookups, neglookups, completed] = entry;

                if (!completed) {
                    poslookups.push(frame);
                }

                for each (var answer in answers) {
                    waitings.push([answer, frame]);
                }

                return;
            }

            table.put(goal, [[], [frame], [], false]);
            var choices = db.lookup(p);
            stack.push([choices, p, a]);
        }

        function neglookup(goal, frame, waitings, stack, table, db) {
            var [p,a] = goal;
            var entry = table.get(goal);

            if (entry !== undefined) {
                var [answers, poslookups, neglookups, completed] = entry;

                if (!completed) {
                    neglookups.push(frame);
                }

                return;
            }

            table.put(goal, [[], [], [frame], false]);
            var choices = db.lookup(p);
            stack.push([choices, p, a]);
        }


        function trace(found, table) {
            var delta = [g for each (g in found)];

            while(delta.length > 0) {
                var nextdelta = [];

                for each (var goal in delta) {
                    var [_,poss,_,_] = table.get(goal);
                    for each (var [[g,_], _, _, _, _] in poss) {
                        if (!is_goal_in_list(g, found)) {
                            found.push(g);
                            nextdelta.push(g);
                        }
                    }
                }

                delta = nextdelta;
            }

            return found;
        }

        function remove_neglookup(goal, frame, table) {
            var entry = table.get(goal);
            var negs = entry[2];
            entry[2] = [neg for each (neg in negs) if (neg !== frame)];
        }


        function complete(goal, waitings, stack, table, db) {
            var entry = table.get(goal);
            var [answers, _, negs, _] = entry;
            entry[1] = [];
            entry[2] = [];
            entry[3] = true;

            var empty = (answers.length === 0);

            for each (var frame in negs) {
                var [parent, s, goals] = frame;

                for each (var [reifiedgoal, _] in goals) {
                    if (is_same_goal(goal, reifiedgoal)) {
                        continue;
                    }

                    remove_neglookup(reifiedgoal, frame, table);
                }

                var neggoals = [g for each ([r,g] in goals) if (!is_same_goal(goal, r))];

                if (empty) {
                    success(parent, s, [], neggoals, waitings, stack, table, db);
                }
            }
        }


        function cont(stack, table, db) {
            while(true) {
                while (stack.length > 0) {
                    var top = stack.pop();

                    if (top[0].length === 0) {
                        continue;
                    }

                    var head = top[0][0];
                    var p = top[1];
                    var a = top[2];

                    stack.push([top[0].slice(1), p, a]);

                    var waitings = [];

                    call(head, p, a, waitings, stack, table, db);
                    proceed(waitings, stack, table, db);
                }


                var active = [];
                var negtargets = [];

                for each (var [goal, [_,_,negs,completed]] in table.data) {
                    if(completed === true) {
                        continue;
                    }

                    active.push(goal);

                    for each (var [[g,_], _, _] in negs) {
                        if (!is_goal_in_list(g, negtargets)) {
                            negtargets.push(g);
                        }
                    }
                }

                var negreachable = trace(negtargets, table);
                var completed = [g for each (g in active) if (!is_goal_in_list(g, negreachable))];

                for each (var goal in completed) {
                    complete(goal, waitings, stack, table, db);
                }

                if (negreachable.length === 0) {
                    return;
                }

                if (completed.length === 0) {
                    throw("negative loop");
                }

                proceed(waitings, stack, table, db);
            }

        }

        function proceed(waitings, stack, table, db) {
            while(waitings.length > 0) {
                var [answer, frame] = waitings.pop();
                var [parent, s, r, posgoals, neggoals] = frame;

                var s1 = subst_of(answer);
                var r1 = s.exts([ [k, s1.subst(v)] for each ([k,v] in r.items()) ]);

                success(parent, r1, posgoals, neggoals, waitings, stack, table, db);
            }
        }

        function call(rule, p, a, waitings, stack, table, db) {
            var [_type, head, posgoals, neggoals] = rule;

            var s = unify_list(a, head);

            if (s === false) {
                return undefined;
            }

            var s1 = nil.exts([[k,v] for each ([k,v] in s.items()) if (reified(k))]);
            var s2 = nil.exts([[k,v] for each ([k,v] in s.items()) if (!reified(k))]);

            return success([[p, a], s1], s2, posgoals, neggoals, waitings, stack, table, db);
        }

        function SingleFileContext(s) {
            this.db = build_db(s, "main");
        }

        SingleFileContext.prototype.lookup = function (p) {
            var [m,f] = p;
            if (m === "main") {
                return this.db[f] || [];
            }

            return [];
        };

        SingleFileContext.prototype.query = function(s) {
            var goals = parse_query(s, "main");

            if (goals[0] === false) {
                return false;
            }

            return query(goals[1], this);
        };

        return {
            nil: nil,
            SingleFileContext: SingleFileContext
        };

    })();



// var ctx = new Datalog.SingleFileContext(
// "p(a). p(b). q(X,Y): p(X), p(Y), not same(X,Y). same(X,X): p(X)."

// );

// try {
//     var answers = ctx.query("q(X,Y).");
//     for each (var answer in answers) {
//         log(answer.toDict());
//     }
// } catch(ex) {
//     print(ex);
//     print(ex.stack);
// }
