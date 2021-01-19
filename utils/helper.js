module.exports = {
    eq(str1, str2){
        return str1.toString() === str2.toString();
    },
    cs(str1, str2){
        if (str1===undefined)
            return true;
        if (str1.toString() === str2.toString())
            return true;
        return false;
    }
};