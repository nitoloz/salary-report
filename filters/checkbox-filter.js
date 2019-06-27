class CheckboxFilter extends BaseFilter {
    constructor(areaId, label, dataKey) {
        super(areaId, label, dataKey);
        this.values = [];
        this.selectedValues = [];
        this.type = FILTER_TYPES.CHECKBOX;

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

        const selectAllButton = document.createElement("button");
        selectAllButton.innerHTML = "Select all";
        selectAllButton.id = that.areaId + '_select_all';
        selectAllButton.className = 'btn btn-outline-secondary btn-sm';
        selectAllButton.onclick = function (event) {
            that.selectedValues = that.values.map(value => value.value).slice();
            const checkBoxes = filterArea.getElementsByTagName('input');
            for (let checkBox of checkBoxes) {
                checkBox.checked = true
            }
            document.dispatchEvent(that.event);
        };

        const deselectAllButton = document.createElement("button");
        deselectAllButton.innerHTML = "Deselect all";
        deselectAllButton.id = that.areaId + '_deselect_all';
        deselectAllButton.className = 'btn btn-outline-secondary btn-sm';
        deselectAllButton.onclick = function (event) {
            that.selectedValues = [];
            const checkBoxes = filterArea.getElementsByTagName('input');
            for (let checkBox of checkBoxes) {
                checkBox.checked = false
            }
            document.dispatchEvent(that.event);
        };

        const buttonGroup = document.createElement("div");
        buttonGroup.role = 'group';
        buttonGroup.className = 'btn-group btn-group-justified';
        buttonGroup.appendChild(selectAllButton);
        buttonGroup.appendChild(deselectAllButton);
        const filterGroup = document.createElement("div");
        filterGroup.className = 'collapse show';
        filterGroup.id = this.areaId + '-filters-group';
        filterGroup.appendChild(buttonGroup);
        this.values.forEach((value, index) => {
            this.appendCheckbox(filterGroup, value, index)
        });
        filterArea.appendChild(filterGroup);
    }


    appendCheckbox(filterArea, value, index) {
        let input = document.createElement("input");
        input.value = (value + '</br>');
        input.checked = true;
        input.type = "checkbox";
        input.id = this.areaId + index;
        const that = this;
        input.addEventListener('change', function () {
            if (this.checked) {
                that.selectedValues.push(value.value);
            } else {
                let selectedItemIndex = that.selectedValues.indexOf(value.value);
                if (selectedItemIndex !== -1) {
                    that.selectedValues.splice(selectedItemIndex, 1);
                }
            }
            document.dispatchEvent(that.event);
        });

        let text = document.createElement("span");
        text.innerHTML = `${value.value} (${value.count})`;
        let br = document.createElement("br");

        filterArea.appendChild(input);
        filterArea.appendChild(text);
        filterArea.appendChild(br);
    }

    isFilterSelected() {
        return this.values.length !== this.selectedValues.length;
    }

    getAppliedValues() {
        return {
            type: FILTER_TYPES.CHECKBOX,
            label: this.label,
            dataKey: this.dataKey,
            values: this.selectedValues
        }
    }

    getSelectedValuesWidgetText(){
        return `${this.label} (${this.values.length > 4 ? this.values.length + ' selected' : this.values.join(',')})`;
    }

    initializeFilterValues(values) {
        const internalMap = new Map();
        values.forEach(d => internalMap[d] ? internalMap[d]++ : internalMap[d] = 1);
        this.values = Object.keys(internalMap).map((key) => {
            return {value: key, count: internalMap[key]};
        }).sort((a, b) => b.count - a.count);
        this.selectedValues = this.values.map(value => value.value).slice();
    }

}