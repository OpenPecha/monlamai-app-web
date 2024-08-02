import inputReplace from '../ttsReplace.server';

describe('inputReplace', () => {
    test('removes \u0F38 character from input', () => {
        const input = "བཀྲ་ཤིས་\u0F38བདེ་ལེགས་";
        const expectedOutput = "བཀྲ་ཤིས་བདེ་ལེགས་";
        const result = inputReplace(input);
        expect(result).toBe(expectedOutput);
    });

    test('handles input without \u0F38 character', () => {
        const input = "བཀྲ་ཤིས་བདེ་ལེགས་";
        const result = inputReplace(input);
        expect(result).toBe(input);
    });

    // test('handles null input', () => {
    //     const input = null;
    //     const result = inputReplace(input);
    //     expect(result).toBe(input); 
    // });

    test('should remove multiple \u0f38 char', () => {
        const input = "བཀྲ་ཤིས་\u0F38བདེ་ལེགས་བཀྲ་ཤིས་\u0F38བདེ་ལེགས་བཀྲ་ཤིས་\u0F38བདེ་ལེགས་བཀྲ་ཤིས་\u0F38བདེ་ལེགས་";
        const expectedOutput = "བཀྲ་ཤིས་བདེ་ལེགས་བཀྲ་ཤིས་བདེ་ལེགས་བཀྲ་ཤིས་བདེ་ལེགས་བཀྲ་ཤིས་བདེ་ལེགས་"
        const result = inputReplace(input);
        expect(result).toBe(expectedOutput);
    });

    test('handles empty input', () => {
        const input = "";
        const result = inputReplace(input);
        expect(result).toBe(input);
    });

});
