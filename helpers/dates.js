module.exports = {

    getIntervalsFromTodayinHours(){
        var today  = new Date();
        today.setMinutes(0);
        today.setMilliseconds(0);

        var start = new Date(today);

        today.setHours(today.getHours()+1);

        var end = new Date(today);

        return {
            start:start,
            end:end
        }
    }
    
}