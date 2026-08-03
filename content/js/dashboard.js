/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.2497320471597, "KoPercent": 0.7502679528403001};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5134383688600556, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/fb754cd2-8cb5-43d7-ae6f-f8b1f7fcbb6e"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3877551020408163, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.0, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.029411764705882353, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ead30005-289d-4c78-beeb-7414f0eb6af6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/3f53732c-bb4a-4bf5-a77c-30539101a56f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.0, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/5907334d-2089-40e0-a681-2b0fd421e88d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/94aae861-dad9-440b-8455-d79f0c8951ac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5907334d-2089-40e0-a681-2b0fd421e88d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.46938775510204084, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.09090909090909091, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.0, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.03211009174311927, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.0625, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/70d3e42d-ea76-46fd-86ae-7053b277a705"], "isController": false}, {"data": [0.07692307692307693, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/6460db4d-9761-4537-bc23-ff4aa53877b9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/08b08bb3-09d3-4be2-a3a9-4c8d55b6afc5"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/980c50d3-85ed-4252-a83c-04145098c454"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/b9669853-bc0f-4d30-b655-0118aca386a6"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/fa2792d5-9e3b-4667-b484-65d64b1b50a9"], "isController": false}, {"data": [0.1111111111111111, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=08b08bb3-09d3-4be2-a3a9-4c8d55b6afc5"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=94aae861-dad9-440b-8455-d79f0c8951ac"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b9669853-bc0f-4d30-b655-0118aca386a6"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/d11e81fc-6217-4451-87d6-188aa944eed4"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ead30005-289d-4c78-beeb-7414f0eb6af6"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fa2792d5-9e3b-4667-b484-65d64b1b50a9"], "isController": false}, {"data": [0.6388888888888888, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/f1372487-8131-4c69-99c0-6067f49a8570"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fb754cd2-8cb5-43d7-ae6f-f8b1f7fcbb6e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.029411764705882353, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 933, 7, 0.7502679528403001, 1747.0246516613079, 103, 22607, 562.0, 4953.800000000003, 7081.9, 14141.139999999996, 3.6877907643173637, 598.2525584851302, 2.694780904022577], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/fb754cd2-8cb5-43d7-ae6f-f8b1f7fcbb6e", 3, 0, 0.0, 7518.333333333333, 4511, 11586, 6458.0, 11586.0, 11586.0, 11586.0, 0.04907654304830768, 0.022205857694384008, 0.03147161126470251], "isController": false}, {"data": ["see books", 49, 0, 0.0, 7444.102040816327, 4032, 12053, 7177.0, 10979.0, 11332.0, 12053.0, 0.22160414264070732, 266.6630406900821, 1.0896258380819934], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 434.8333333333333, 224, 1306, 329.0, 1175.5000000000002, 1306.0, 1306.0, 0.09562514941429597, 12.842947313198925, 0.21234469214014395], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 7, 0, 0.0, 2737.428571428571, 759, 4868, 2905.0, 4868.0, 4868.0, 4868.0, 0.03614936919350758, 0.02806518409066262, 0.012849971080504646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 11, 0, 0.0, 269.0, 219, 452, 229.0, 451.6, 452.0, 452.0, 0.05332428436386552, 0.08264222586470175, 0.11992756532224835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 167.62499999999997, 109, 339, 113.5, 339.0, 339.0, 339.0, 0.06506445447521451, 0.04835356431214672, 0.03265930625025416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 137.87499999999997, 107, 326, 111.0, 326.0, 326.0, 326.0, 0.06506868813391137, 0.01741095756708175, 0.03710948620137132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 198.87499999999997, 113, 344, 114.0, 344.0, 344.0, 344.0, 0.06494666255337804, 0.017505155141340174, 0.03818153404016951], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 139.875, 109, 339, 111.0, 339.0, 339.0, 339.0, 0.06506604203266314, 0.01753733164161624, 0.03831525717353113], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 3449.0, 3449, 3449, 3449.0, 3449.0, 3449.0, 3449.0, 0.28993911278631485, 0.08550938677877647, 0.1792299398376341], "isController": false}, {"data": ["https://demoqa.com/books", 49, 0, 0.0, 1296.6326530612248, 852, 2039, 1208.0, 1837.0, 2024.0, 2039.0, 0.2268508016166592, 271.39242483252394, 0.44794171959852036], "isController": false}, {"data": ["deleteBook", 9, 1, 11.11111111111111, 5763.0, 2852, 11044, 5198.0, 11044.0, 11044.0, 11044.0, 0.05408426328219366, 0.010457699345580414, 0.03647284031020329], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 9, 1, 11.11111111111111, 5763.0, 2852, 11044, 5198.0, 11044.0, 11044.0, 11044.0, 0.05422764766489724, 0.010485424060204739, 0.03656953453096097], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 17, 2, 11.764705882352942, 6690.411764705881, 1250, 11879, 6971.0, 10021.399999999998, 11879.0, 11879.0, 0.06932719991517614, 0.022190438759614052, 0.03127848277422986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 3, 0, 0.0, 183.66666666666666, 112, 326, 113.0, 326.0, 326.0, 326.0, 0.01923582480010772, 0.005184655903154034, 0.011327346049282183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 198.53846153846152, 103, 344, 119.0, 342.8, 344.0, 344.0, 0.10650936053418542, 0.02849957498668633, 0.06074361967965261], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 3, 0, 0.0, 186.33333333333334, 108, 338, 113.0, 338.0, 338.0, 338.0, 0.01923644151480565, 0.00518482212703746, 0.011308923624915038], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ead30005-289d-4c78-beeb-7414f0eb6af6", 1, 0, 0.0, 2855.0, 2855, 2855, 2855.0, 2855.0, 2855.0, 2855.0, 0.3502626970227671, 0.06327988178633975, 0.24148971103327496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 131.23076923076923, 104, 340, 115.0, 256.79999999999995, 340.0, 340.0, 0.1066973079448457, 0.07929360483010506, 0.05355704715200262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 249.99999999999997, 113, 341, 325.0, 340.2, 341.0, 341.0, 0.10669555654043762, 0.028757786723789827, 0.06282951229871472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 231.53846153846152, 109, 341, 321.0, 340.2, 341.0, 341.0, 0.10669292954163076, 0.028757078665517667, 0.06272377303131027], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 7, 0, 0.0, 207.7142857142857, 104, 342, 114.0, 342.0, 342.0, 342.0, 0.03704350495059984, 0.009984382193716362, 0.021777529277598733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 7, 0, 0.0, 203.42857142857144, 106, 333, 114.0, 333.0, 333.0, 333.0, 0.03708845065646558, 0.009996496466000487, 0.02184017162680541], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 3, 0, 0.0, 188.33333333333334, 113, 339, 113.0, 339.0, 339.0, 339.0, 0.01923582480010772, 0.005147085932841323, 0.010970431331311434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 7, 0, 0.0, 175.28571428571428, 108, 340, 115.0, 340.0, 340.0, 340.0, 0.03708884367582231, 0.027563095739551544, 0.018616860985715498], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f53732c-bb4a-4bf5-a77c-30539101a56f", 1, 0, 0.0, 6431.0, 6431, 6431, 6431.0, 6431.0, 6431.0, 6431.0, 0.15549681231534754, 0.04965572033898305, 0.09278178937956771], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 3, 0, 0.0, 114.33333333333333, 114, 115, 114.0, 115.0, 115.0, 115.0, 0.019235454790269425, 0.014295098725971712, 0.009655296642771958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 7, 0, 0.0, 175.42857142857142, 108, 340, 111.0, 340.0, 340.0, 340.0, 0.03704409305476175, 0.009912188961918672, 0.021126709320293813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 3, 0, 0.0, 2825.6666666666665, 821, 4399, 3257.0, 4399.0, 4399.0, 4399.0, 0.01794118878316877, 0.014121677889876984, 0.006377531950267025], "isController": false}, {"data": ["deleteAccount", 8, 1, 12.5, 10037.875, 114, 20190, 10073.0, 20190.0, 20190.0, 20190.0, 0.055064184189696115, 0.010546350707230616, 0.037473489606635234], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 15, 0, 0.0, 6022.133333333332, 3134, 7944, 6115.0, 7799.4, 7944.0, 7944.0, 0.06542304723107856, 0.03386153811764809, 0.030092046138513677], "isController": false}, {"data": ["goToProfile", 10, 1, 10.0, 3866.2, 115, 6939, 3687.5, 6911.9, 6939.0, 6939.0, 0.05865033841245264, 0.0894933142279856, 0.037910799800002344], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 0, 0.0, 304.0, 228, 454, 230.0, 454.0, 454.0, 454.0, 0.019221404956559628, 0.02978942350201184, 0.043229390248981266], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5907334d-2089-40e0-a681-2b0fd421e88d", 3, 0, 0.0, 5056.333333333334, 2226, 10690, 2253.0, 10690.0, 10690.0, 10690.0, 0.03715538381511481, 0.016811843588219265, 0.023826857459562555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 125.27777777777777, 109, 341, 114.0, 139.40000000000032, 341.0, 341.0, 0.09568309758081235, 0.07110823951074043, 0.048028429840368696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 172.44444444444446, 107, 344, 112.5, 335.90000000000003, 344.0, 344.0, 0.0956836062088029, 0.04157087231554327, 0.05367667579204763], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 2, 0, 0.0, 821.0, 647, 995, 821.0, 995.0, 995.0, 995.0, 0.0214947445349612, 6.32016858596823, 0.01225872149259506], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 2, 0, 0.0, 1290.0, 1258, 1322, 1290.0, 1322.0, 1322.0, 1322.0, 0.02133970679242867, 19.201505683030668, 0.012149461972642496], "isController": false}, {"data": ["addBook", 30, 1, 3.3333333333333335, 17741.56666666667, 9024, 31650, 18436.0, 23124.100000000002, 27406.199999999993, 31650.0, 0.152807844135999, 73.75427782376163, 0.5497550697185789], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 2, 0, 0.0, 226.0, 112, 340, 226.0, 340.0, 340.0, 340.0, 0.021565667457407806, 0.03816112249299116, 0.011941145945654518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 1, 0, 0.0, 316.0, 316, 316, 316.0, 316.0, 316.0, 316.0, 3.1645569620253164, 2.3517850079113924, 1.588459256329114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/94aae861-dad9-440b-8455-d79f0c8951ac", 3, 0, 0.0, 4688.666666666667, 3462, 5883, 4721.0, 5883.0, 5883.0, 5883.0, 0.03398432189949703, 0.015753149213829355, 0.02179333142643527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 1, 0, 0.0, 106.0, 106, 106, 106.0, 106.0, 106.0, 106.0, 9.433962264150942, 2.524321933962264, 5.380306603773585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 1, 0, 0.0, 338.0, 338, 338, 338.0, 338.0, 338.0, 338.0, 2.9585798816568047, 0.7974297337278106, 1.7393213757396448], "isController": false}, {"data": ["https://demoqa.com/books-0", 49, 0, 0.0, 202.61224489795921, 107, 466, 116.0, 458.0, 461.0, 466.0, 0.22816591853079773, 0.16956471093939168, 0.11029504850853993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 1, 0, 0.0, 322.0, 322, 322, 322.0, 322.0, 322.0, 322.0, 3.105590062111801, 0.8370535714285714, 1.8287800854037266], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5907334d-2089-40e0-a681-2b0fd421e88d", 1, 0, 0.0, 6915.0, 6915, 6915, 6915.0, 6915.0, 6915.0, 6915.0, 0.14461315979754158, 0.02612640093998554, 0.0997039949385394], "isController": false}, {"data": ["https://demoqa.com/books-3", 49, 0, 0.0, 725.4285714285713, 537, 1004, 675.0, 924.0, 973.0, 1004.0, 0.22800772434331448, 67.04184152590679, 0.1146718535515693], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 2, 0, 0.0, 110.0, 109, 111, 110.0, 111.0, 111.0, 111.0, 0.021619050707483434, 0.01606650155116689, 0.012139603668752906], "isController": false}, {"data": ["https://demoqa.com/books-1", 49, 0, 0.0, 172.77551020408163, 104, 342, 115.0, 339.0, 340.0, 342.0, 0.22856503141603032, 0.4044529657478974, 0.11115760316912413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 258.88888888888886, 107, 1195, 114.5, 1063.6000000000001, 1195.0, 1195.0, 0.09568208034105345, 9.589024285308017, 0.055336967037523326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 726.1666666666667, 112, 1473, 962.0, 1356.0000000000002, 1473.0, 1473.0, 0.10157497644024852, 50.788469141663235, 0.05486547664057694], "isController": false}, {"data": ["https://demoqa.com/books-2", 49, 0, 0.0, 1090.3265306122448, 739, 1567, 1044.0, 1370.0, 1552.0, 1567.0, 0.22736658453628816, 204.5848524335765, 0.11412736762856653], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 11, 0, 0.0, 3466.909090909091, 843, 6217, 3102.0, 6209.6, 6217.0, 6217.0, 0.055015954626841786, 0.04110078641556051, 0.019556452621260163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 209.27777777777777, 107, 899, 113.5, 868.4000000000001, 899.0, 899.0, 0.09568157172928493, 3.148874711626374, 0.05543011192086071], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 599.0000000000001, 106, 1117, 869.0, 1035.1000000000001, 1117.0, 1117.0, 0.10157554963658526, 16.6047146926211, 0.05496498112387703], "isController": false}, {"data": ["deleteBooks", 8, 1, 12.5, 7115.875, 2430, 14738, 6267.0, 14738.0, 14738.0, 14738.0, 0.056124990353517284, 0.010941358593086805, 0.03819541274668688], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 109, 1, 0.9174311926605505, 5141.082568807341, 595, 22607, 3377.0, 12852.0, 14373.0, 22157.800000000025, 0.4637449317784405, 1.2756309483796582, 0.21027153143254637], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 2201.0, 1292, 3070, 2094.0, 3070.0, 3070.0, 3070.0, 0.06235774639104543, 0.0482907157110342, 0.02216623016244193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 1, 0, 0.0, 654.0, 654, 654, 654.0, 654.0, 654.0, 654.0, 1.529051987767584, 2.3697319380733943, 3.43887375764526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70d3e42d-ea76-46fd-86ae-7053b277a705", 1, 0, 0.0, 1843.0, 1843, 1843, 1843.0, 1843.0, 1843.0, 1843.0, 0.5425935973955507, 0.17326963510580576, 0.323754578133478], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 3316.6923076923076, 546, 6129, 3466.0, 6050.2, 6129.0, 6129.0, 0.09808137736432705, 0.07959533651343337, 0.03486486460997563], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 15, 0, 0.0, 3382.333333333333, 1718, 5492, 3601.0, 4853.6, 5492.0, 5492.0, 0.06650911396558375, 0.040853742855812676, 0.030071991959048125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 137.3888888888889, 105, 340, 114.0, 334.6, 340.0, 340.0, 0.10157726926441127, 0.07548857608419626, 0.050987027736237686], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6460db4d-9761-4537-bc23-ff4aa53877b9", 1, 0, 0.0, 2010.0, 2010, 2010, 2010.0, 2010.0, 2010.0, 2010.0, 0.49751243781094523, 0.15887360074626866, 0.296855565920398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 169.2777777777778, 108, 457, 114.0, 350.8000000000002, 457.0, 457.0, 0.10157669604866652, 0.11193716634876924, 0.053191095391803896], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/08b08bb3-09d3-4be2-a3a9-4c8d55b6afc5", 3, 0, 0.0, 10368.0, 6668, 14810, 9626.0, 14810.0, 14810.0, 14810.0, 0.015927286627450146, 0.013277923519824163, 0.010213787322941663], "isController": false}, {"data": ["login", 15, 0, 0.0, 13769.866666666667, 6703, 20063, 12732.0, 19589.0, 20063.0, 20063.0, 0.06488450558006748, 10.44131939938576, 0.11224259100051907], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/980c50d3-85ed-4252-a83c-04145098c454", 2, 0, 0.0, 4971.5, 3913, 6030, 4971.5, 6030.0, 6030.0, 6030.0, 0.010939303275774366, 0.01546885853839969, 0.006799674350615609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 368.0, 225, 684, 231.0, 684.0, 684.0, 684.0, 0.06488503183421875, 0.10055912648525893, 0.14592795733809158], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b9669853-bc0f-4d30-b655-0118aca386a6", 3, 0, 0.0, 10200.0, 1698, 20190, 8712.0, 20190.0, 20190.0, 20190.0, 0.017264001104896072, 0.014392287379439726, 0.011070990291876713], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa2792d5-9e3b-4667-b484-65d64b1b50a9", 3, 0, 0.0, 7720.0, 6765, 9456, 6939.0, 9456.0, 9456.0, 9456.0, 0.014678396336272274, 0.014721399450538696, 0.009412903900539187], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 2738.3888888888882, 117, 5530, 2643.0, 4442.800000000002, 5530.0, 5530.0, 0.09265979954596698, 0.07501462287461585, 0.03293766311985545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=08b08bb3-09d3-4be2-a3a9-4c8d55b6afc5", 1, 0, 0.0, 11009.0, 11009, 11009, 11009.0, 11009.0, 11009.0, 11009.0, 0.09083477155054956, 0.016410578844581705, 0.06262631710418748], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 7, 0, 0.0, 417.7142857142857, 221, 676, 452.0, 676.0, 676.0, 676.0, 0.03702175821618591, 0.05737649442293657, 0.08326280192566031], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=94aae861-dad9-440b-8455-d79f0c8951ac", 1, 0, 0.0, 5619.0, 5619, 5619, 5619.0, 5619.0, 5619.0, 5619.0, 0.1779676098949991, 0.03215235139704574, 0.12270032479088806], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b9669853-bc0f-4d30-b655-0118aca386a6", 1, 0, 0.0, 9912.0, 9912, 9912, 9912.0, 9912.0, 9912.0, 9912.0, 0.10088781275221953, 0.018226802108555287, 0.0695574177764326], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d11e81fc-6217-4451-87d6-188aa944eed4", 1, 0, 0.0, 1614.0, 1614, 1614, 1614.0, 1614.0, 1614.0, 1614.0, 0.6195786864931846, 0.1978537407063197, 0.36969001703841387], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ead30005-289d-4c78-beeb-7414f0eb6af6", 3, 0, 0.0, 5029.666666666667, 831, 8736, 5522.0, 8736.0, 8736.0, 8736.0, 0.042941184890428405, 0.01942976790289567, 0.027537153071010408], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 1, 0, 0.0, 6390.0, 6390, 6390, 6390.0, 6390.0, 6390.0, 6390.0, 0.15649452269170577, 0.12974985328638497, 0.055628912363067294], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fa2792d5-9e3b-4667-b484-65d64b1b50a9", 1, 0, 0.0, 14738.0, 14738, 14738, 14738.0, 14738.0, 14738.0, 14738.0, 0.06785181164337088, 0.012258383939476184, 0.04678064357443344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 873.5000000000001, 229, 1617, 1088.0, 1592.7, 1617.0, 1617.0, 0.10151139183397248, 67.53820775998196, 0.21387225425783896], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f1372487-8131-4c69-99c0-6067f49a8570", 2, 0, 0.0, 3916.5, 1661, 6172, 3916.5, 6172.0, 6172.0, 6172.0, 0.011209380009191692, 0.015850763919247626, 0.006967549195166516], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 2851.1111111111118, 1821, 4569, 2621.5, 4121.700000000001, 4569.0, 4569.0, 0.09796611460946897, 0.07605767686965609, 0.034823892302584675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 434.69230769230774, 241, 674, 450.0, 587.5999999999999, 674.0, 674.0, 0.10641258615326687, 0.1649187248293306, 0.23932440030368515], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 2, 50.0, 757.25, 114, 1431, 742.0, 1431.0, 1431.0, 1431.0, 0.0426289258576407, 25.505211053147615, 0.062184529296729296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 11, 0, 0.0, 114.27272727272727, 106, 126, 114.0, 124.2, 126.0, 126.0, 0.053411540777283585, 0.039693537628430475, 0.026810089804222424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 11, 0, 0.0, 111.63636363636363, 105, 118, 111.0, 117.6, 118.0, 118.0, 0.05341439372235198, 0.014292523320238714, 0.030462896419778864], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fb754cd2-8cb5-43d7-ae6f-f8b1f7fcbb6e", 1, 0, 0.0, 2430.0, 2430, 2430, 2430.0, 2430.0, 2430.0, 2430.0, 0.411522633744856, 0.07434735082304526, 0.2837255658436214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 11, 0, 0.0, 132.27272727272728, 108, 337, 112.0, 292.8000000000002, 337.0, 337.0, 0.05335428701696181, 0.014380647672540488, 0.03136648514083106], "isController": false}, {"data": ["register", 17, 2, 11.764705882352942, 6690.411764705881, 1250, 11879, 6971.0, 10021.399999999998, 11879.0, 11879.0, 0.07095750897403791, 0.022712272518574172, 0.032014032369146], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 11, 0, 0.0, 129.9090909090909, 103, 333, 110.0, 289.40000000000015, 333.0, 333.0, 0.053412578176591695, 0.014396358961659481, 0.031452914687973434], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 2, 28.571428571428573, 0.21436227224008575], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 14.285714285714286, 0.10718113612004287], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 14.285714285714286, 0.10718113612004287], "isController": false}, {"data": ["401/Unauthorized", 3, 42.857142857142854, 0.3215434083601286], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 933, 7, "401/Unauthorized", 3, "406/Not Acceptable", 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 9, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 17, 2, "406/Not Acceptable", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 109, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
