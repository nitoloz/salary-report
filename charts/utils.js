const margin = {top: 50, right: 50, bottom: 50, left: 100};
const height = 600;
const width = 1000;

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