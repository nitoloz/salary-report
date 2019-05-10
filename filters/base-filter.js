class BaseFilter {
    constructor(areaId,label,dataKey) {
        this.areaId = areaId;
        this.label= label;
        this.dataKey= dataKey;
    }

    addFilterPlaceholder(){
        const filterArea = document.getElementById(this.areaId);
        filterArea.innerHTML = `<hr><h5 class="text-center">${this.label}
                                                <button type="button" data-toggle="collapse"  
                                                    id=${this.areaId + '-filters-group-toggle'}
                                                    aria-expanded="true" aria-controls=${this.areaId + '-filters-group'} 
                                                    class="btn btn-link btn-sm" data-target=${'#' + this.areaId + '-filters-group'}>
                                                      <i class="fas fa-minus-square" id=${this.areaId + '-filters-group-icon'}></i>
                                                </button>
                                                </h5>`;
    }
}