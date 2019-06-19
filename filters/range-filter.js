class RangeFilter extends BaseFilter {
    constructor(areaId, label, dataKey) {
        super(areaId, label, dataKey);
        this.values = {from: null, to: null};
        this.selectedValues = {from: null, to: null};
        this.type = FILTER_TYPES.NUMBER_RANGE;

    }

    appendFilter() {
        this.addFilterPlaceholder();
        const filterArea = document.getElementById(this.areaId);

        const that = this;
        const expandCollapseButton = document.getElementById(this.areaId + '-filters-group-toggle');
        expandCollapseButton.onclick = function (event) {
            const icon = document.getElementById(that.areaId + '-filters-group-icon');
            if (icon.className === 'fas fa-minus-square') {
                icon.className = 'fas fa-plus-square';
            } else {
                icon.className = 'fas fa-minus-square';
            }
        };

        const resetButton = document.createElement("button");
        resetButton.innerHTML = "Reset filter";
        resetButton.id = that.areaId + '_reset';
        resetButton.className = 'btn btn-outline-secondary btn-sm';
        resetButton.onclick = function (event) {
            that.selectedValues = {from: that.values.from, to: that.values.to};
            document.dispatchEvent(that.event);
        };

        const buttonGroup = document.createElement("div");
        buttonGroup.role = 'group';
        buttonGroup.className = 'btn-group btn-group-justified';
        buttonGroup.appendChild(resetButton);

        const filterGroup = document.createElement("div");
        filterGroup.className = 'collapse show';
        filterGroup.id = this.areaId + '-filters-group';
        filterGroup.appendChild(buttonGroup);
        this.appendSlider(filterGroup, this.values);
        filterArea.appendChild(filterGroup);
    }


    appendSlider(filterArea, values) {
        let sliderDiv = document.createElement("div");
        sliderDiv.id = this.areaId + '-slider';
        const that = this;
        noUiSlider.create(sliderDiv, {
            start: [this.values.from, this.values.to],
            connect: true,
            behaviour: 'drag',
            step: 1,
            range: {
                'min': this.values.from,
                'max': this.values.to
            }
        });
        filterArea.appendChild(sliderDiv);
        sliderDiv.noUiSlider.on('slide', function (values) {
            console.log(values);
        });

        // input.value = (value + '</br>');
        // input.checked = true;
        // input.type = "checkbox";
        // input.id = this.areaId + index;
        // const that = this;
        // input.addEventListener('change', function () {
        //     if (this.checked) {
        //         that.selectedValues.push(value.value);
        //     } else {
        //         let selectedItemIndex = that.selectedValues.indexOf(value.value);
        //         if (selectedItemIndex !== -1) {
        //             that.selectedValues.splice(selectedItemIndex, 1);
        //         }
        //     }
        //     document.dispatchEvent(that.event);
        // });
        //
        // let text = document.createElement("span");
        // text.innerHTML = `${value.value} (${value.count})`;
        // let br = document.createElement("br");
        //
        // filterArea.appendChild(input);
        // filterArea.appendChild(text);
        // filterArea.appendChild(br);
    }

    isFilterSelected() {
        return this.values.from !== this.selectedValues.from || this.values.to !== this.selectedValues.to;
    }

    getAppliedValues() {
        return {
            type: FILTER_TYPES.NUMBER_RANGE,
            label: this.label,
            dataKey: this.dataKey,
            values: this.selectedValues
        }
    }

    initializeFilterValues(values) {
        this.values = {from: parseInt(d3.min(values)), to: parseInt(d3.max(values))};
        this.selectedValues = {from: this.values.from, to: this.values.to};
    }

}