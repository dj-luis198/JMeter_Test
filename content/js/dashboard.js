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

    var data = {"OkPercent": 98.13953488372093, "KoPercent": 1.8604651162790697};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7667551426675514, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.00909090909090909, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=acc93e88-765a-4ff1-83b8-74fedb0746d1"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8486a0e3-9e7b-4e68-b05e-35c8ac5f65bb"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=45962805-da5b-4cca-a9fd-b41c8b1624d9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dd5e91f3-c87d-4053-ae90-ea1ec5c28048"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=457432e3-1b68-435d-9e89-b739766da435"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8486a0e3-9e7b-4e68-b05e-35c8ac5f65bb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=241e10dc-8fd1-4b41-b32b-b01a33d718f4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7636eee-5bb6-4b2a-821f-7dbfabeda148"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ae31dc6e-f1ca-4e11-a3a9-cc6d900a29d2"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/725bf23a-3f63-4ece-b241-f34fe041abc3"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=469f3b77-b76c-474c-8598-e614e2e31739"], "isController": false}, {"data": [0.1875, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cfc8f67a-8642-40ff-984a-5b0f9846cfb4"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1b46cdfb-439d-4ccf-9819-2e698626c001"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.38181818181818183, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.1875, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae31dc6e-f1ca-4e11-a3a9-cc6d900a29d2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a7636eee-5bb6-4b2a-821f-7dbfabeda148"], "isController": false}, {"data": [0.30357142857142855, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/457432e3-1b68-435d-9e89-b739766da435"], "isController": false}, {"data": [0.9818181818181818, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/acc93e88-765a-4ff1-83b8-74fedb0746d1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2639b780-9243-41dd-900d-c9815f7bbdba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2639b780-9243-41dd-900d-c9815f7bbdba"], "isController": false}, {"data": [0.9401197604790419, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/45962805-da5b-4cca-a9fd-b41c8b1624d9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/52bd8208-156a-4b6a-9a53-4080c3198fae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dd5e91f3-c87d-4053-ae90-ea1ec5c28048"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/241e10dc-8fd1-4b41-b32b-b01a33d718f4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=725bf23a-3f63-4ece-b241-f34fe041abc3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1b46cdfb-439d-4ccf-9819-2e698626c001"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/469f3b77-b76c-474c-8598-e614e2e31739"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cfc8f67a-8642-40ff-984a-5b0f9846cfb4"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1290, 24, 1.8604651162790697, 403.75813953488364, 109, 2984, 128.0, 1134.0, 1356.0, 1771.7799999999966, 5.10147586883275, 731.8762477174356, 3.734370242082826], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1885.2181818181823, 1385, 2494, 1853.0, 2298.2, 2342.9999999999995, 2494.0, 0.2497037605386337, 300.478187135092, 1.2277914397578327], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=acc93e88-765a-4ff1-83b8-74fedb0746d1", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 583.5333333333334, 117, 1295, 558.0, 1039.4, 1295.0, 1295.0, 0.08310847872699972, 0.016280821125621237, 0.05595754472621297], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 583.5333333333334, 117, 1295, 558.0, 1039.4, 1295.0, 1295.0, 0.08451561285088065, 0.01655647650184244, 0.05690497839217498], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 145.17647058823533, 112, 341, 115.0, 340.2, 341.0, 341.0, 0.11271340958063981, 0.04011789325377093, 0.06372503315100282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 129.88235294117646, 111, 344, 116.0, 169.59999999999985, 344.0, 344.0, 0.11270892588393633, 0.08376122323991753, 0.05657459756283523], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 219.29411764705884, 110, 905, 116.0, 456.1999999999996, 905.0, 905.0, 0.1127126622730829, 1.9780787339384458, 0.06580300934520573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 243.11764705882354, 112, 1235, 115.0, 589.3999999999994, 1235.0, 1235.0, 0.11271340958063981, 5.994458861677441, 0.06569337394331179], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8486a0e3-9e7b-4e68-b05e-35c8ac5f65bb", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 263.06666666666666, 115, 444, 249.0, 414.0, 444.0, 444.0, 0.08261458643138032, 0.1649763808339667, 0.05339828216736613], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 116.11764705882354, 114, 119, 116.0, 118.2, 119.0, 119.0, 0.08921964301646364, 0.06630483235891488, 0.044784078623498355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 141.76470588235293, 112, 346, 115.0, 345.2, 346.0, 346.0, 0.08922104776999865, 0.03963899261564622, 0.05000232893176164], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 792.125, 676, 1138, 682.5, 1138.0, 1138.0, 1138.0, 0.06987021607364322, 20.54416343516917, 0.03984785760449964], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=45962805-da5b-4cca-a9fd-b41c8b1624d9", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1189.625, 1006, 1338, 1227.0, 1338.0, 1338.0, 1338.0, 0.0696009256923117, 62.627035283319266, 0.03962630827990012], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 284.375, 114, 346, 339.0, 346.0, 346.0, 346.0, 0.07021793892794762, 0.12425283724359482, 0.03888044079311162], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd5e91f3-c87d-4053-ae90-ea1ec5c28048", 3, 0, 0.0, 369.66666666666663, 209, 685, 215.0, 685.0, 685.0, 685.0, 0.020553435506744953, 0.024293464949541314, 0.01318042576441652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 124.0, 112, 227, 116.0, 173.5, 227.0, 227.0, 0.06320370554296498, 0.04697072257636362, 0.03172529750887109], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 130.78571428571428, 112, 339, 115.0, 228.0, 339.0, 339.0, 0.06320456156350027, 0.016912158074608472, 0.03604635151668375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 163.0, 111, 342, 115.0, 341.0, 342.0, 342.0, 0.06320427622074545, 0.0170355275751228, 0.037157201450086684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 131.0, 111, 346, 114.5, 232.5, 346.0, 346.0, 0.06320456156350027, 0.017035604483912184, 0.03721909240506901], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 115.375, 112, 120, 115.0, 120.0, 120.0, 120.0, 0.0702160900170274, 0.05218207470991978, 0.03942798023417066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 778.6111111111111, 110, 1580, 1010.5, 1392.8000000000002, 1580.0, 1580.0, 0.09821092432848282, 49.10641059873199, 0.05304839206892224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 235.52941176470588, 113, 1028, 116.0, 1019.2, 1028.0, 1028.0, 0.08921964301646364, 9.465923262578658, 0.051549354863257776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 542.2222222222223, 112, 1024, 678.0, 1011.4, 1024.0, 1024.0, 0.09820931679051953, 16.054431320315143, 0.05314343129712683], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 235.7058823529412, 114, 918, 116.0, 908.4, 918.0, 918.0, 0.08911347815147194, 3.1038191677849536, 0.051575039773442084], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 394.00000000000006, 117, 602, 448.0, 581.0, 602.0, 602.0, 0.08467830711128423, 0.01658834805324572, 0.0575768385071779], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 289.1428571428571, 229, 463, 234.5, 460.5, 463.0, 463.0, 0.06317062385503244, 0.0979021289628286, 0.14207221361146455], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=457432e3-1b68-435d-9e89-b739766da435", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 579.2727272727273, 183, 1397, 495.0, 1067.3, 1351.5499999999993, 1397.0, 0.09745120795201857, 0.059860165822089535, 0.044062411407992774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 115.33333333333334, 111, 128, 115.0, 118.10000000000002, 128.0, 128.0, 0.09820556607325043, 0.07298284744310897, 0.04929459078286204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 178.83333333333337, 109, 362, 115.5, 345.8, 362.0, 362.0, 0.09820717348842792, 0.1082239641871174, 0.0514266296934845], "isController": false}, {"data": ["login", 22, 0, 0.0, 2987.454545454546, 1764, 4007, 2920.0, 3974.6, 4003.4, 4007.0, 0.09477039717411906, 41.35501138860171, 0.20013347279658827], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 133.76470588235293, 117, 337, 119.0, 178.59999999999985, 337.0, 337.0, 0.08485701592816104, 0.06869772090277883, 0.0301640173807135], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8486a0e3-9e7b-4e68-b05e-35c8ac5f65bb", 3, 0, 0.0, 389.66666666666663, 218, 699, 252.0, 699.0, 699.0, 699.0, 0.04210940022177618, 0.02707228692643488, 0.02700374949117808], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=241e10dc-8fd1-4b41-b32b-b01a33d718f4", 1, 0, 0.0, 388.0, 388, 388, 388.0, 388.0, 388.0, 388.0, 2.577319587628866, 0.46562902706185566, 1.7769410438144329], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7636eee-5bb6-4b2a-821f-7dbfabeda148", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 223.0, 4.484304932735426, 0.8101527466367713, 3.0917180493273544], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae31dc6e-f1ca-4e11-a3a9-cc6d900a29d2", 3, 0, 0.0, 386.6666666666667, 280, 449, 431.0, 449.0, 449.0, 449.0, 0.026054105692822092, 0.026130436080594035, 0.016707873767857918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 895.6111111111112, 227, 1700, 1126.5, 1509.2000000000003, 1700.0, 1700.0, 0.09814345301382188, 65.29742918677245, 0.2067764135383441], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/725bf23a-3f63-4ece-b241-f34fe041abc3", 3, 0, 0.0, 387.0, 250, 578, 333.0, 578.0, 578.0, 578.0, 0.015013286758781523, 0.020697027807109292, 0.009627661105077994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 428.29411764705884, 229, 1353, 453.0, 820.1999999999996, 1353.0, 1353.0, 0.11262231114232148, 8.089889373422459, 0.2515951894539143], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, 33.333333333333336, 910.0833333333334, 115, 1456, 1228.0, 1429.6000000000001, 1456.0, 1456.0, 0.10429431856699607, 83.1908113446145, 0.17981603459964018], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=469f3b77-b76c-474c-8598-e614e2e31739", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.4250919117647059, 1.6222426470588236], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 1180.1666666666665, 179, 2775, 1145.0, 1694.0, 2510.0, 2775.0, 0.09460924411156008, 0.02956538878486252, 0.042685030058145265], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 122.86666666666666, 116, 141, 120.0, 138.6, 141.0, 141.0, 0.07403130043382342, 0.05747547250477502, 0.02631581382608567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 366.2941176470588, 231, 1145, 233.0, 1136.2, 1145.0, 1145.0, 0.0890593239873431, 12.656599729744244, 0.197615723096226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cfc8f67a-8642-40ff-984a-5b0f9846cfb4", 1, 0, 0.0, 567.0, 567, 567, 567.0, 567.0, 567.0, 567.0, 1.763668430335097, 0.3186315035273369, 1.2159667107583776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 407.68749999999994, 230, 1133, 454.0, 729.1000000000004, 1133.0, 1133.0, 0.08948195540443048, 6.820732558359013, 0.19981609011392173], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1b46cdfb-439d-4ccf-9819-2e698626c001", 1, 0, 0.0, 602.0, 602, 602, 602.0, 602.0, 602.0, 602.0, 1.6611295681063123, 0.3001064161129568, 1.1452709717607974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 117.63636363636364, 113, 132, 116.0, 130.6, 132.0, 132.0, 0.05410882760927524, 0.04021173614322115, 0.02716009510856198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 135.9090909090909, 112, 342, 115.0, 297.40000000000015, 342.0, 342.0, 0.054109626102483634, 0.014478552296953629, 0.0308593961365727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 157.45454545454544, 113, 350, 115.0, 347.8, 350.0, 350.0, 0.054109626102483634, 0.014584235160435041, 0.031810541907905415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 178.09090909090912, 113, 350, 116.0, 349.0, 350.0, 350.0, 0.054110158444382134, 0.014584378643212374, 0.031863696818322684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 117.5, 117, 118, 117.5, 118.0, 118.0, 118.0, 0.04762244922256352, 0.014044902016810724, 0.02943848667761983], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1309.6545454545453, 895, 2024, 1228.0, 1816.4, 1852.9999999999998, 2024.0, 0.24242210536987, 290.0211175824345, 0.47868896197058314], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 1180.1666666666665, 179, 2775, 1145.0, 1694.0, 2510.0, 2775.0, 0.09638012320592416, 0.0301187885018513, 0.04348400089954781], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 3, 0, 0.0, 115.33333333333333, 114, 116, 116.0, 116.0, 116.0, 116.0, 0.025634014628477683, 0.006909168005331875, 0.01509503009860551], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 3, 0, 0.0, 114.0, 113, 115, 114.0, 115.0, 115.0, 115.0, 0.02563467174802827, 0.006909345119585744, 0.015070383195618181], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 160.20000000000002, 112, 341, 116.0, 340.4, 341.0, 341.0, 0.07220286115871152, 0.019460927421683965, 0.04244738517338314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 160.8, 112, 351, 115.0, 345.6, 351.0, 351.0, 0.07220251361017381, 0.01946083374649216, 0.042517691120053526], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae31dc6e-f1ca-4e11-a3a9-cc6d900a29d2", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 132.1333333333333, 114, 341, 116.0, 211.4000000000001, 341.0, 341.0, 0.07220216606498195, 0.053658055054151624, 0.036242102888086644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 3, 0, 0.0, 115.66666666666667, 115, 117, 115.0, 117.0, 117.0, 117.0, 0.0256342336645846, 0.006859160179781425, 0.014619523886833402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 144.66666666666666, 111, 342, 115.0, 341.4, 342.0, 342.0, 0.0722032087105951, 0.0193199992057647, 0.04117839246776126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 3, 0, 0.0, 118.0, 117, 119, 118.0, 119.0, 119.0, 119.0, 0.02563313852148057, 0.019049627358248743, 0.012866633984415052], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 619.8666666666667, 117, 1732, 532.0, 1411.0000000000002, 1732.0, 1732.0, 0.08556662217202314, 0.016450405942316688, 0.05823098317474986], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 3, 0, 0.0, 118.33333333333333, 117, 120, 118.0, 120.0, 120.0, 120.0, 0.025374270489723422, 0.019972326186247145, 0.009019760213143872], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1538.590909090909, 816, 2822, 1402.0, 2245.5999999999995, 2755.699999999999, 2822.0, 0.09737701725343696, 0.05040021400812656, 0.044789624146844544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 0, 0.0, 234.66666666666666, 233, 237, 234.0, 237.0, 237.0, 237.0, 0.0256077574433215, 0.03968702252202267, 0.05759244667184513], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7636eee-5bb6-4b2a-821f-7dbfabeda148", 3, 0, 0.0, 373.3333333333333, 214, 474, 432.0, 474.0, 474.0, 474.0, 0.06694187214102422, 0.03028945386589312, 0.04292821878835212], "isController": false}, {"data": ["addBook", 56, 8, 14.285714285714286, 1122.178571428571, 582, 2380, 933.0, 1941.5000000000002, 2277.35, 2380.0, 0.2812261459965449, 85.21649018627467, 1.0228433862264474], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/457432e3-1b68-435d-9e89-b739766da435", 3, 0, 0.0, 289.6666666666667, 202, 451, 216.0, 451.0, 451.0, 451.0, 0.07176003444481653, 0.046134787769698135, 0.04601799083863561], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 194.3090909090909, 112, 551, 117.0, 461.8, 478.9999999999999, 551.0, 0.2437802786186966, 0.18116874221565246, 0.1178430057775926], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 756.7272727272727, 548, 1066, 685.0, 1018.1999999999999, 1033.3999999999999, 1066.0, 0.24325734858335765, 71.52573738765933, 0.12234134230510663], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 166.92727272727276, 112, 352, 117.0, 344.4, 346.4, 352.0, 0.24420566557144127, 0.4321295566557144, 0.11876408345173609], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/acc93e88-765a-4ff1-83b8-74fedb0746d1", 3, 0, 0.0, 489.33333333333337, 229, 795, 444.0, 795.0, 795.0, 795.0, 0.05151983513652757, 0.03312228984200584, 0.033038435943671646], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1100.6363636363637, 777, 1472, 1108.0, 1364.6, 1394.1999999999996, 1472.0, 0.24296720384506645, 218.6223171105788, 0.12195814724254311], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2639b780-9243-41dd-900d-c9815f7bbdba", 3, 0, 0.0, 587.6666666666666, 249, 974, 540.0, 974.0, 974.0, 974.0, 0.06716518156987418, 0.030390495567098018, 0.043071421774951865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 132.5625, 117, 346, 118.0, 189.20000000000016, 346.0, 346.0, 0.08793962944438642, 0.06569708645015197, 0.03125979015405923], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2639b780-9243-41dd-900d-c9815f7bbdba", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 0.8988261815920398, 3.4301150497512434], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 8, 4.790419161676646, 182.71856287425157, 113, 682, 122.0, 335.4000000000001, 373.7999999999999, 669.7599999999999, 0.6905677542075012, 1.5162583542674606, 0.33077455624819085], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 123.27272727272727, 117, 137, 123.0, 135.4, 137.0, 137.0, 0.05482647420912811, 0.04245839262484237, 0.01948909825402601], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 139.47058823529412, 117, 396, 121.0, 195.19999999999982, 396.0, 396.0, 0.11619323618667468, 0.09429353444445963, 0.04130306442573202], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45962805-da5b-4cca-a9fd-b41c8b1624d9", 3, 0, 0.0, 618.0, 342, 980, 532.0, 980.0, 980.0, 980.0, 0.023294276596240303, 0.02753304632843377, 0.014938061489125454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/52bd8208-156a-4b6a-9a53-4080c3198fae", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 0.6212761429961089, 1.160855423151751], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 318.0909090909091, 230, 464, 244.0, 463.2, 464.0, 464.0, 0.05407823645954703, 0.08381070435673937, 0.12162322125618828], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dd5e91f3-c87d-4053-ae90-ea1ec5c28048", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.3787506551362684, 1.445394392033543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 324.66666666666663, 230, 684, 235.0, 553.8000000000001, 684.0, 684.0, 0.07216152636060558, 0.11183627181082134, 0.16229296407077604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/241e10dc-8fd1-4b41-b32b-b01a33d718f4", 3, 0, 0.0, 1669.3333333333333, 292, 2984, 1732.0, 2984.0, 2984.0, 2984.0, 0.02203775802541688, 0.026047883916109602, 0.014132286233747154], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=725bf23a-3f63-4ece-b241-f34fe041abc3", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 156.3571428571429, 115, 362, 120.0, 354.5, 362.0, 362.0, 0.06420251306979731, 0.05323040390259561, 0.02282198706777951], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 122.33333333333333, 114, 144, 119.0, 140.4, 144.0, 144.0, 0.1007060613859392, 0.07818488164240396, 0.03579785775828307], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b46cdfb-439d-4ccf-9819-2e698626c001", 3, 0, 0.0, 354.6666666666667, 272, 413, 379.0, 413.0, 413.0, 413.0, 0.022943848754149013, 0.023160441076372426, 0.014713340509659362], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/469f3b77-b76c-474c-8598-e614e2e31739", 3, 0, 0.0, 487.3333333333333, 394, 542, 526.0, 542.0, 542.0, 542.0, 0.027582148833275106, 0.02272474566960263, 0.017687771224463526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 115.4375, 113, 119, 115.0, 117.6, 119.0, 119.0, 0.08970369747428027, 0.0666645642362571, 0.04502705127126959], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 199.93749999999997, 112, 348, 116.0, 344.5, 348.0, 348.0, 0.08970470332972645, 0.0324237825389795, 0.0506888515275029], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 241.62500000000003, 111, 1017, 116.0, 545.2000000000005, 1017.0, 1017.0, 0.0897057092077304, 5.0675020131222634, 0.05225532767813592], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cfc8f67a-8642-40ff-984a-5b0f9846cfb4", 3, 0, 0.0, 577.6666666666667, 223, 1197, 313.0, 1197.0, 1197.0, 1197.0, 0.02084013532194536, 0.028729808948059436, 0.013364279487054802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 241.0, 112, 908, 115.5, 581.1000000000004, 908.0, 908.0, 0.08954154727793696, 1.6681376022732362, 0.05224714306500717], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 33.333333333333336, 0.6201550387596899], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.333333333333334, 0.15503875968992248], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.333333333333334, 0.15503875968992248], "isController": false}, {"data": ["401/Unauthorized", 12, 50.0, 0.9302325581395349], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1290, 24, "401/Unauthorized", 12, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
