var DatalogParser = (
    function() {
        var QUERY = {
            ACTIONS: [
                {'11': ['shift', 4], '9': ['shift', 6]},
                {'-1': ['reduce', 0]},
                {'5': ['shift', 8], '4': ['shift', 9]},
                {'5': ['reduce', 3], '4': ['reduce', 3]},
                {'9': ['shift', 6]},
                {'5': ['reduce', 5], '4': ['reduce', 5]},
                {'3': ['shift', 11], '6': ['shift', 12]},
                {'5': ['reduce', 7], '4': ['reduce', 7]},
                {'-1': ['reduce', 1]},
                {'11': ['shift', 4], '9': ['shift', 6]},
                {'5': ['reduce', 4], '4': ['reduce', 4]},
                {'9': ['shift', 15]},
                {'2': ['shift', 18], '8': ['shift', 19], '9': ['shift', 20], '10': ['shift', 21]},
                {'5': ['reduce', 2], '4': ['reduce', 2]},
                {'5': ['reduce', 6], '4': ['reduce', 6]},
                {'6': ['shift', 12]},
                {'7': ['shift', 22], '4': ['shift', 23]},
                {'7': ['reduce', 10], '4': ['reduce', 10]},
                {'7': ['reduce', 11], '4': ['reduce', 11]},
                {'7': ['reduce', 12], '4': ['reduce', 12]},
                {'7': ['reduce', 13], '4': ['reduce', 13]},
                {'7': ['reduce', 14], '4': ['reduce', 14]},
                {'5': ['reduce', 8], '4': ['reduce', 8]},
                {'2': ['shift', 18], '8': ['shift', 19], '9': ['shift', 20], '10': ['shift', 21]},
                {'7': ['reduce', 9], '4': ['reduce', 9]}],

            GOTOS: [
                {'Query': ['goto', 1], 'NMFAs': ['goto', 2], 'NMFA': ['goto', 3], 'MFA': ['goto', 5], 'FA': ['goto', 7]},
                {},
                {},
                {},
                {'MFA': ['goto', 10], 'FA': ['goto', 7]},
                {},
                {},
                {},
                {},
                {'NMFA': ['goto', 13], 'MFA': ['goto', 5], 'FA': ['goto', 7]},
                {},
                {'FA': ['goto', 14]},
                {'Ts': ['goto', 16], 'T': ['goto', 17]},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {'T': ['goto', 24]},
                {}],

            GRAMMAR: [
                ['prime', [['nt', 'Query']]],
                ['Query', [['nt', 'NMFAs'], ['t', 5]]],
                ['NMFAs', [['nt', 'NMFAs'], ['t', 4], ['nt', 'NMFA']]],
                ['NMFAs', [['nt', 'NMFA']]],
                ['NMFA', [['t', 11], ['nt', 'MFA']]],
                ['NMFA', [['nt', 'MFA']]],
                ['MFA', [['t', 9], ['t', 3], ['nt', 'FA']]],
                ['MFA', [['nt', 'FA']]],
                ['FA', [['t', 9], ['t', 6], ['nt', 'Ts'], ['t', 7]]],
                ['Ts', [['nt', 'Ts'], ['t', 4], ['nt', 'T']]],
                ['Ts', [['nt', 'T']]],
                ['T', [['t', 2]]],
                ['T', [['t', 8]]],
                ['T', [['t', 9]]],
                ['T', [['t', 10]]]]
        };

        var CLAUSES = {
            ACTIONS: [
                {'9': ['shift', 4]},
                {'9': ['shift', 4], '-1': ['reduce', 0]},
                {'9': ['reduce', 2], '-1': ['reduce', 2]},
                {'5': ['shift', 6], '3': ['shift', 7]},
                {'6': ['shift', 8]},
                {'9': ['reduce', 1], '-1': ['reduce', 1]},
                {'9': ['reduce', 3], '-1': ['reduce', 3]},
                {'11': ['shift', 11], '9': ['shift', 13]},
                {'2': ['shift', 17], '8': ['shift', 18], '9': ['shift', 19], '10': ['shift', 20]},
                {'5': ['shift', 21], '4': ['shift', 22]},
                {'5': ['reduce', 6], '4': ['reduce', 6]},
                {'9': ['shift', 13]},
                {'5': ['reduce', 8], '4': ['reduce', 8]},
                {'3': ['shift', 24], '6': ['shift', 8]},
                {'5': ['reduce', 10], '4': ['reduce', 10]},
                {'7': ['shift', 25], '4': ['shift', 26]},
                {'7': ['reduce', 13], '4': ['reduce', 13]},
                {'7': ['reduce', 14], '4': ['reduce', 14]},
                {'7': ['reduce', 15], '4': ['reduce', 15]},
                {'7': ['reduce', 16], '4': ['reduce', 16]},
                {'7': ['reduce', 17], '4': ['reduce', 17]},
                {'9': ['reduce', 4], '-1': ['reduce', 4]},
                {'11': ['shift', 11], '9': ['shift', 13]},
                {'5': ['reduce', 7], '4': ['reduce', 7]},
                {'9': ['shift', 4]},
                {'5': ['reduce', 11], '3': ['reduce', 11], '5': ['reduce', 11], '4': ['reduce', 11]},
                {'2': ['shift', 17], '8': ['shift', 18], '9': ['shift', 19], '10': ['shift', 20]},
                {'5': ['reduce', 5], '4': ['reduce', 5]},
                {'5': ['reduce', 9], '4': ['reduce', 9]},
                {'7': ['reduce', 12], '4': ['reduce', 12]}],

            GOTOS: [
                {'Clauses': ['goto', 1], 'Clause': ['goto', 2], 'FA': ['goto', 3]},
                {'Clause': ['goto', 5], 'FA': ['goto', 3]},
                {},
                {},
                {},
                {},
                {},
                {'NMFAs': ['goto', 9], 'NMFA': ['goto', 10], 'MFA': ['goto', 12], 'FA': ['goto', 14]},
                {'Ts': ['goto', 15], 'T': ['goto', 16]},
                {},
                {},
                {'MFA': ['goto', 23], 'FA': ['goto', 14]},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {'NMFA': ['goto', 27], 'MFA': ['goto', 12], 'FA': ['goto', 14]},
                {},
                {'FA': ['goto', 28]},
                {},
                {'T': ['goto', 29]},
                {},
                {},
                {}],


            GRAMMAR: [
                ['prime', [['nt', 'Clauses']]],
                ['Clauses', [['nt', 'Clauses'], ['nt', 'Clause']]],
                ['Clauses', [['nt', 'Clause']]],
                ['Clause', [['nt', 'FA'], ['t', 5]]],
                ['Clause', [['nt', 'FA'], ['t', 3], ['nt', 'NMFAs'], ['t', 5]]],
                ['NMFAs', [['nt', 'NMFAs'], ['t', 4], ['nt', 'NMFA']]],
                ['NMFAs', [['nt', 'NMFA']]],
                ['NMFA', [['t', 11], ['nt', 'MFA']]],
                ['NMFA', [['nt', 'MFA']]],
                ['MFA', [['t', 9], ['t', 3], ['nt', 'FA']]],
                ['MFA', [['nt', 'FA']]],
                ['FA', [['t', 9], ['t', 6], ['nt', 'Ts'], ['t', 7]]],
                ['Ts', [['nt', 'Ts'], ['t', 4], ['nt', 'T']]],
                ['Ts', [['nt', 'T']]],
                ['T', [['t', 2]]],
                ['T', [['t', 8]]],
                ['T', [['t', 9]]],
                ['T', [['t', 10]]]]
        };


        function parse(tokens, mode) {
            var stack = [[0, null]];
            var token = tokens[0];
            tokens = tokens.slice(1);

            while (true) {
                var state = stack.slice(-1)[0][0];
                var action = mode.ACTIONS[state][token[0]];

                if(action === undefined) {
                    return false;
                }

                if (action[0] === 'shift') {
                    stack.push([action[1], token[1]]);
                    token = tokens[0];
                    tokens = tokens.slice(1);
                } else if (action[0] === 'reduce') {
                    var rule_num = action[1];
                    var [name, prod] = mode.GRAMMAR[rule_num];

                    var found = stack.slice(-(prod.length));
                    stack = stack.slice(0, -(prod.length));

                    if (rule_num === 0) {
                        return found[0][1];
                    }

                    var next_state = mode.GOTOS[stack.slice(-1)[0][0]][name][1];

                    stack.push(
                        [next_state,
                         [rule_num,
                          [s for each ([_,s] in found)]]]);
                }
            }
        }

        function construct_query(ast) {
            if (ast[0] === 1) {
                return construct_query(ast[1][0]);
            } else if (ast[0] === 2) {
                return construct_query(ast[1][0]).concat([construct_query(ast[1][2])]);
            } else if (ast[0] === 3) {
                return [construct_query(ast[1][0])];
            } else if (ast[0] === 4) {
                return [false].concat(construct_query(ast[1][1]));
            } else if (ast[0] === 5) {
                return [true].concat(construct_query(ast[1][0]));
            } else if (ast[0] === 6) {
                return [ast[1][0]].concat(construct_query(ast[1][2]));
            } else if (ast[0] === 7) {
                return [null].concat(construct_query(ast[1][0]));
            } else if (ast[0] === 8) {
                var args = construct_query(ast[1][2]);
                return [ast[1][0]+"/"+(args.length), args];
            } else if (ast[0] === 9) {
                return construct_query(ast[1][0]).concat([construct_query(ast[1][2])]);
            } else if (ast[0] === 10) {
                return [construct_query(ast[1][0])];
            } else if (ast[0] === 11) {
                return ["str", ast[1][0]];
            } else if (ast[0] === 12) {
                return ["var", ast[1][0]];
            } else if (ast[0] === 13) {
                return ast[1][0];
            } else if (ast[0] === 14) {
                return Number(ast[1][0]);
            }

            return null;
        }

        function parse_query(tokens) {
            var ast = parse(tokens, QUERY);

            if (ast == false) {
                return false;
            }

            return construct_query(ast);
        }

        function construct_clauses(ast) {
            if (ast[0] === 1) {
                return construct_clauses(ast[1][0]).concat([construct_clauses(ast[1][1])]);
            } else if (ast[0] === 2) {
                return [construct_clauses(ast[1][0])];
            } else if (ast[0] === 3) {
                return [construct_clauses(ast[1][0]), []];
            } else if (ast[0] === 4) {
                return [construct_clauses(ast[1][0]), construct_clauses(ast[1][2])];
            } else if (ast[0] === 5) {
                return construct_clauses(ast[1][0]).concat([construct_clauses(ast[1][2])]);
            } else if (ast[0] === 6) {
                return [construct_clauses(ast[1][0])];
            } else if (ast[0] === 7) {
                return [false].concat(construct_clauses(ast[1][1]));
            } else if (ast[0] === 8) {
                return [true].concat(construct_clauses(ast[1][0]));
            } else if (ast[0] === 9) {
                return [ast[1][0]].concat(construct_clauses(ast[1][2]));
            } else if (ast[0] === 10) {
                return [null].concat(construct_clauses(ast[1][0]));
            } else if (ast[0] === 11) {
                var args = construct_clauses(ast[1][2]);
                return [ast[1][0]+"/"+(args.length), args];
            } else if (ast[0] === 12) {
                return construct_clauses(ast[1][0]).concat([construct_clauses(ast[1][2])]);
            } else if (ast[0] === 13) {
                return [construct_clauses(ast[1][0])];
            } else if (ast[0] === 14) {
                return ["str", ast[1][0]];
            } else if (ast[0] === 15) {
                return ["var", ast[1][0]];
            } else if (ast[0] === 16) {
                return ast[1][0];
            } else if (ast[0] === 17) {
                return Number(ast[1][0]);
            }

            return undefined;
        }

        function parse_clauses(tokens) {
            var ast = parse(tokens, CLAUSES);

            if (ast == false) {
                return false;
            }

            return construct_clauses(ast);
        }


        return {
            parse_query: parse_query,
            parse_clauses: parse_clauses};
    })();
