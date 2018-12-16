class Utils {
    static getSexColorScale(){
        return d3.scaleOrdinal() // D3 Version 4
            .domain(["Male", "Female"])
            .range(["#80b1d3", "#fb8072"]);
    }

    static appendXAxis(){
        //TODO move x axis creation operation here
    }

    static appendYAxis(){
        //TODO move y axis creation operation here
    }
}