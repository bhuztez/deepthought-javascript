var DatalogLexer = (
    function() {
        var CODE = {
            START: 0,
            MATCH: {
                '0': [],
                '1': [0],
                '2': [8],
                '3': [9],
                '4': [10],
                '5': [1],
                '6': [2],
                '7': [3],
                '8': [4],
                '9': [5],
                '10': [6],
                '11': [7]},

            DFA: {
                '0': {'0': 1, '1': 5, '2': 6, '3': 7, '4': 8, '5': 9, '6': 10, '7': 11, '8': 2, '9': 3, '10': 4},
                '1': {'0': 1},
                '2': {'8': 2, '9': 2, '10': 2},
                '3': {'8': 3, '9': 3, '10': 3},
                '4': {'10': 4},
                '5': {},
                '6': {},
                '7': {},
                '8': {},
                '9': {},
                '10': {},
                '11': {}}
        };

        var QUOTE = {
            START: 1,
            MATCH: {
                '0': [],
                '1': [],
                '2': [0]},

            DFA: {
                '0': {'0': 1, '1': 1, '2': 1},
                '1': {'0': 2, '1': 0, '2': 1},
                '2': {}}
        };

        var CODE_MAP = [-1,-1,-1,-1,-1,-1,-1,-1,-1,0,0,-1,-1,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,-1,2,-1,-1,-1,-1,1,6,7,-1,-1,4,-1,5,-1,10,10,10,10,10,10,10,10,10,10,3,-1,-1,-1,-1,-1,-1,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,-1,-1,-1,-1,8,-1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,-1,-1,-1,-1,-1];

        var SINGLE_QUOTE_MAP = [-1,-1,-1,-1,-1,-1,-1,-1,-1,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,-1];

        var DOUBLE_QUOTE_MAP = [-1,-1,-1,-1,-1,-1,-1,-1,-1,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,2,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,-1];


        var MODE = [
            [CODE, CODE_MAP],
            [QUOTE, SINGLE_QUOTE_MAP],
            [QUOTE, DOUBLE_QUOTE_MAP]];

        function next_mode(match, mode) {
            if ((match === 1) && (mode === 0)) {
                return 1;
            } else if ((match === 2) && (mode === 0)) {
                return 2;
            } else if ((match === 0) && (mode > 0)) {
                return 0;
            } else {
                return mode;
            }
        }

        function finish(state, dfa) {
            var match = dfa.MATCH[state] || [];

            if (match.length === 0) {
                return -1;
            } else {
                return match[0];
            }
        }

        function tokens(s, found, state, mode) {
            var result = [];

            while (s.length > 0) {
                var [dfa, charmap] = MODE[mode];
                var code = s.charCodeAt(0);

                code = (code>127)?-1:charmap[code];
                var next_state = (dfa.DFA[state] || {})[code];

                if (next_state === undefined) {
                    next_state = -1;
                }

                if (next_state >= 0) {
                    found += s[0];
                    state = next_state;
                    s = s.slice(1);
                } else {
                    var match = finish(state, dfa);

                    if (match < 0) {
                        return [false, mode, found];
                    }

                    result.push([mode, match, found]);

                    mode = next_mode(match, mode);
                    found = "";
                    state = MODE[mode][0].START;
                }

            }

            var match = finish(state, dfa);

            if (match < 0) {
                return [false, mode, found];
            }

            result.push([mode, match, found]);
            return [true, result];
        }

        function convert_tokens(tokens) {
            var result = [];

            for each (let token in tokens) {
                var [mode, match, s] = token;

                if ((mode === 0) && (match in [0,1,2])) {
                    continue;
                }

                if (mode === 0) {
                    if ((match === 9) && (s === 'not')) {
                        result.push([11, s]);
                    } else {
                        result.push([match, s]);
                    }
                } else if (mode === 1) {
                    result.push([9, s.slice(0, -1)]);
                } else if (mode === 2) {
                    result.push([2, s.slice(0, -1)]);
                }
            }

            result.push([-1, null]);
            return result;
        }


        function tokenize(s) {
            var result = tokens(s, '', MODE[0][0].START, 0);

            if (result[0]) {
                return [true, convert_tokens(result[1])];
            } else {
                return result;
            }
        }

        return {
            tokenize: tokenize
        };

    })();
