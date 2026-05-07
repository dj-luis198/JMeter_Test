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

    var data = {"OkPercent": 99.15966386554622, "KoPercent": 0.8403361344537815};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.80946123521682, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.14545454545454545, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/532f8bb2-9296-430b-8761-173c1148d8a2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d42cbb87-8743-4634-b483-993b5e18b0fe"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/87f32c2f-e6fa-48fa-992c-b8fa5b79fee5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/12a9f8dd-e8ec-4e90-9016-03b7c07c7f0b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1720acd0-b89c-4136-9c07-ef044fb35e9c"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6ec0c7d1-4741-414d-b077-cd3952a67125"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a35f50bd-cf40-4d12-9cb1-fee4c62b7315"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eda8cd15-5dee-4f19-bdf5-fbff39bb3459"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8d7b0482-4161-4963-b305-933cb6ced7b1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ecfbd554-72b5-4d0e-a617-6fb28051df64"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ce946b3e-2e10-44a0-bb5b-209497c27f93"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1d600532-06c5-4938-877d-9fad73272a96"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=faf84bd1-b474-4219-af24-4cfac54f159b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=34251de9-3606-4e8e-bc6f-205700fbc908"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9347826086956522, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1062abc5-345b-47cd-a9d1-aac73968a196"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6abb1905-1c08-4561-b695-64d4d49765be"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ece8c5a4-948d-4cf7-b023-97cd725f577a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d42cbb87-8743-4634-b483-993b5e18b0fe"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.41818181818181815, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=532f8bb2-9296-430b-8761-173c1148d8a2"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1d600532-06c5-4938-877d-9fad73272a96"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.38636363636363635, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ce946b3e-2e10-44a0-bb5b-209497c27f93"], "isController": false}, {"data": [0.3524590163934426, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8d7b0482-4161-4963-b305-933cb6ced7b1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=87f32c2f-e6fa-48fa-992c-b8fa5b79fee5"], "isController": false}, {"data": [0.6272727272727273, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.963276836158192, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a35f50bd-cf40-4d12-9cb1-fee4c62b7315"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ecfbd554-72b5-4d0e-a617-6fb28051df64"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/34251de9-3606-4e8e-bc6f-205700fbc908"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ece8c5a4-948d-4cf7-b023-97cd725f577a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/faf84bd1-b474-4219-af24-4cfac54f159b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6ec0c7d1-4741-414d-b077-cd3952a67125"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6abb1905-1c08-4561-b695-64d4d49765be"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1309, 11, 0.8403361344537815, 340.0137509549273, 92, 1973, 114.0, 960.0, 1146.0, 1547.4000000000015, 5.086715085665878, 691.3500516528425, 3.7186540047680667], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1639.6, 1153, 2282, 1610.0, 2048.4, 2240.0, 2282.0, 0.24223205831186276, 291.48844632220164, 1.1910531382814735], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/532f8bb2-9296-430b-8761-173c1148d8a2", 3, 0, 0.0, 441.33333333333337, 282, 740, 302.0, 740.0, 740.0, 740.0, 0.017473556684217885, 0.024088708514864172, 0.01120537326429337], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d42cbb87-8743-4634-b483-993b5e18b0fe", 3, 0, 0.0, 423.0, 199, 677, 393.0, 677.0, 677.0, 677.0, 0.04798694755026633, 0.030850983532479163, 0.030772879776700734], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 564.3076923076924, 403, 1138, 437.0, 1041.6, 1138.0, 1138.0, 0.0861189501437524, 0.015558599391205267, 0.058533973925831706], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 564.3076923076924, 403, 1138, 437.0, 1041.6, 1138.0, 1138.0, 0.0863253936105928, 0.015595896306601237, 0.05867429096969979], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 23, 0, 0.0, 124.95652173913041, 94, 301, 99.0, 289.0, 299.79999999999995, 301.0, 0.10546056462669252, 0.03510575860535281, 0.05976038958508145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 23, 0, 0.0, 116.69565217391306, 95, 293, 100.0, 218.00000000000026, 292.0, 293.0, 0.1054523447099602, 0.0783683928948044, 0.05293213396574174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 23, 0, 0.0, 176.69565217391303, 94, 812, 99.0, 347.0000000000001, 724.5999999999988, 812.0, 0.10546056462669252, 1.3754024266246658, 0.06170822185463866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 23, 0, 0.0, 173.43478260869566, 94, 1023, 99.0, 303.8, 879.3999999999979, 1023.0, 0.10546008106670579, 4.15297876727482, 0.06160495054839242], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 311.7692307692308, 184, 1217, 212.0, 877.3999999999996, 1217.0, 1217.0, 0.08759222450560927, 0.22399447916315737, 0.056627004514368494], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/87f32c2f-e6fa-48fa-992c-b8fa5b79fee5", 3, 0, 0.0, 328.0, 189, 536, 259.0, 536.0, 536.0, 536.0, 0.07973210014351778, 0.03607669895816723, 0.05113028557380535], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/12a9f8dd-e8ec-4e90-9016-03b7c07c7f0b", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.697240038209607, 1.302794077510917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 100.5625, 95, 111, 101.5, 106.80000000000001, 111.0, 111.0, 0.15367179546284024, 0.11420335580783343, 0.07713603795693348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 111.3125, 95, 298, 98.5, 165.70000000000013, 298.0, 298.0, 0.15338305500699811, 0.041041950265544414, 0.08747627355867861], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 622.8, 557, 851, 574.0, 851.0, 851.0, 851.0, 0.15507722845977295, 45.59785421577446, 0.08844248185596428], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 966.0, 645, 1198, 1053.0, 1198.0, 1198.0, 1198.0, 0.15280706579872255, 137.4960664118609, 0.08699855406313989], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 246.0, 93, 296, 280.0, 296.0, 296.0, 296.0, 0.15642597922662996, 0.27680065855337255, 0.0866147756069328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 134.41176470588232, 94, 413, 99.0, 385.0, 413.0, 413.0, 0.11693332049359619, 0.08690064149963544, 0.05869504563838714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 156.52941176470588, 94, 305, 101.0, 304.2, 305.0, 305.0, 0.11676706344572735, 0.0415607034185275, 0.06601685652762228], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 186.47058823529412, 95, 999, 101.0, 444.5999999999995, 999.0, 999.0, 0.11676626141905351, 6.21000245767223, 0.06805551978157841], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 183.76470588235293, 93, 783, 99.0, 400.5999999999997, 783.0, 783.0, 0.11693734222057135, 2.052220799197947, 0.06826942836555988], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 100.0, 96, 104, 101.0, 104.0, 104.0, 104.0, 0.15740099477428698, 0.11697476271800038, 0.08838434765157717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 778.0714285714287, 95, 1237, 1005.5, 1210.0, 1237.0, 1237.0, 0.08248783304462591, 53.02256456514182, 0.04343039647187754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 134.875, 94, 302, 99.0, 295.0, 302.0, 302.0, 0.1533771736421327, 0.04133994133323108, 0.09016900247320693], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1720acd0-b89c-4136-9c07-ef044fb35e9c", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 1.3764480064655171, 2.571895204741379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 581.0714285714287, 94, 884, 763.5, 874.5, 884.0, 884.0, 0.08248929112238465, 17.331059906374655, 0.04351172010794313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 97.18749999999999, 93, 102, 96.5, 102.0, 102.0, 102.0, 0.153683603880511, 0.04142253385841898, 0.0904992315819806], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 499.84615384615387, 294, 933, 453.0, 889.8, 933.0, 933.0, 0.08629788702942758, 0.015590926855902444, 0.059498347893335815], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 369.47058823529414, 190, 1113, 206.0, 784.1999999999997, 1113.0, 1113.0, 0.11668771621547416, 8.381915677681073, 0.26067719415806384], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6ec0c7d1-4741-414d-b077-cd3952a67125", 3, 0, 0.0, 653.3333333333334, 350, 1217, 393.0, 1217.0, 1217.0, 1217.0, 0.018227552768765268, 0.02512815298688831, 0.01168889288882408], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a35f50bd-cf40-4d12-9cb1-fee4c62b7315", 3, 0, 0.0, 266.6666666666667, 190, 416, 194.0, 416.0, 416.0, 416.0, 0.03490198359606771, 0.029096347652841605, 0.022381805886801234], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eda8cd15-5dee-4f19-bdf5-fbff39bb3459", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 1.46484375, 2.7370627866972477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 588.590909090909, 126, 1307, 485.0, 1134.6, 1281.9499999999996, 1307.0, 0.09518947031386564, 0.0584708758080288, 0.04303977026886699], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 99.78571428571429, 95, 105, 100.5, 104.5, 105.0, 105.0, 0.08248686102142302, 0.06130127073955363, 0.04140453766114398], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8d7b0482-4161-4963-b305-933cb6ced7b1", 3, 0, 0.0, 446.66666666666663, 191, 880, 269.0, 880.0, 880.0, 880.0, 0.02118494456606172, 0.025039887278440785, 0.013585397394251818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 165.00000000000003, 93, 297, 99.0, 295.0, 297.0, 297.0, 0.0824912353062487, 0.1105713991102731, 0.04209722917832837], "isController": false}, {"data": ["login", 22, 0, 0.0, 2336.681818181818, 1424, 3275, 2297.0, 3194.5, 3271.7, 3275.0, 0.09152556475433705, 25.01172102513833, 0.17258549319798644], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ecfbd554-72b5-4d0e-a617-6fb28051df64", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 104.5625, 98, 113, 105.0, 111.6, 113.0, 113.0, 0.14333578198627558, 0.116040393815061, 0.0509513912529339], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ce946b3e-2e10-44a0-bb5b-209497c27f93", 3, 0, 0.0, 336.6666666666667, 212, 473, 325.0, 473.0, 473.0, 473.0, 0.020660872439773558, 0.02442045176719329, 0.013249322495557913], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1d600532-06c5-4938-877d-9fad73272a96", 3, 0, 0.0, 397.6666666666667, 211, 614, 368.0, 614.0, 614.0, 614.0, 0.017497710716181298, 0.024122006797860616, 0.01122086266630116], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=faf84bd1-b474-4219-af24-4cfac54f159b", 1, 0, 0.0, 383.0, 383, 383, 383.0, 383.0, 383.0, 383.0, 2.6109660574412534, 0.4717077349869452, 1.8001387075718016], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=34251de9-3606-4e8e-bc6f-205700fbc908", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 879.3571428571429, 196, 1335, 1105.0, 1310.5, 1335.0, 1335.0, 0.08243780362137494, 70.48241296187253, 0.17033849182982483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 23, 0, 0.0, 348.9130434782609, 195, 1121, 234.0, 595.2, 1016.3999999999985, 1121.0, 0.10540450123048298, 5.6388812429252955, 0.23588464021548347], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 0, 0.0, 1066.2, 749, 1295, 1154.0, 1295.0, 1295.0, 1295.0, 0.15235077241841616, 182.2644895106493, 0.3435331381973856], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1062abc5-345b-47cd-a9d1-aac73968a196", 1, 0, 0.0, 384.0, 384, 384, 384.0, 384.0, 384.0, 384.0, 2.6041666666666665, 0.83160400390625, 1.5538533528645833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6abb1905-1c08-4561-b695-64d4d49765be", 3, 0, 0.0, 301.0, 184, 527, 192.0, 527.0, 527.0, 527.0, 0.027960817574305873, 0.028042734032043094, 0.017930602415814637], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 998.6956521739131, 137, 1646, 1012.0, 1540.6000000000001, 1632.9999999999998, 1646.0, 0.09357505533133707, 0.029623624853534695, 0.04221843316706809], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ece8c5a4-948d-4cf7-b023-97cd725f577a", 3, 0, 0.0, 524.6666666666666, 268, 947, 359.0, 947.0, 947.0, 947.0, 0.01730632777031042, 0.023858169956791866, 0.011098133368330574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 237.5, 193, 403, 203.5, 400.9, 403.0, 403.0, 0.15322588368240103, 0.2374701927773149, 0.34460860363336876], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 112.40000000000002, 95, 171, 107.0, 143.4, 171.0, 171.0, 0.13005479642089202, 0.10097027651817299, 0.04623041591523896], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d42cbb87-8743-4634-b483-993b5e18b0fe", 1, 0, 0.0, 536.0, 536, 536, 536.0, 536.0, 536.0, 536.0, 1.8656716417910448, 0.3370598180970149, 1.2862931436567164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 398.00000000000006, 193, 1397, 390.0, 1001.3999999999996, 1397.0, 1397.0, 0.0953701462097703, 8.913039391538467, 0.21261266744796825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 100.6923076923077, 96, 105, 100.0, 104.6, 105.0, 105.0, 0.06025632111984055, 0.04478033239472525, 0.030245848687107463], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 100.0, 93, 114, 98.0, 110.0, 114.0, 114.0, 0.06025660041530703, 0.016123348158002076, 0.034365092424354794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 130.69230769230768, 94, 291, 102.0, 289.0, 291.0, 291.0, 0.06025632111984055, 0.016240961551832023, 0.03542412628334376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 133.69230769230768, 94, 305, 104.0, 304.6, 305.0, 305.0, 0.06025352830757109, 0.01624020880165002, 0.03548132575143102], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1117.2545454545452, 754, 1868, 1046.0, 1629.3999999999999, 1779.6, 1868.0, 0.23233906295543735, 277.95829342205866, 0.4587788918905218], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=532f8bb2-9296-430b-8761-173c1148d8a2", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 998.6956521739131, 137, 1646, 1012.0, 1540.6000000000001, 1632.9999999999998, 1646.0, 0.08992418999808423, 0.028467848192328296, 0.04057126540929191], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 97.2, 94, 99, 98.0, 99.0, 99.0, 99.0, 0.023018244260400795, 0.006204136148311151, 0.013554688758810234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 174.6, 98, 292, 104.0, 292.0, 292.0, 292.0, 0.023018350228802404, 0.006204164710106898, 0.013532272302479538], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1d600532-06c5-4938-877d-9fad73272a96", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.3936036220043573, 1.502076525054466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 182.9333333333333, 95, 940, 101.0, 561.4000000000002, 940.0, 940.0, 0.1350937550660158, 8.137824407951618, 0.0786463774609579], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 226.26666666666665, 94, 902, 102.0, 594.8000000000002, 902.0, 902.0, 0.1350888884886255, 2.6820245377708534, 0.07877546706983195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 179.0, 97, 305, 102.0, 305.0, 305.0, 305.0, 0.02301782039655101, 0.006159065223295875, 0.013127350694907997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 125.93333333333331, 94, 304, 100.0, 292.0, 304.0, 304.0, 0.1348435814455232, 0.10021090378910465, 0.06768515709277238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 138.2, 98, 278, 105.0, 278.0, 278.0, 278.0, 0.023016972715680543, 0.01710538694983681, 0.011553441382675585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 122.53333333333335, 92, 288, 98.0, 283.8, 288.0, 288.0, 0.13509862199405565, 0.04967688912906422, 0.0762920213005494], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 107.4, 100, 111, 110.0, 111.0, 111.0, 111.0, 0.023839038809955183, 0.018763930938304568, 0.008474033326976256], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 589.9230769230768, 393, 947, 527.0, 920.1999999999999, 947.0, 947.0, 0.08999155463871852, 0.016258239851721607, 0.061254017171080866], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1276.0909090909088, 775, 1973, 1231.5, 1681.3, 1930.9999999999993, 1973.0, 0.09339010319606404, 0.04833667450577533, 0.04295579941928336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 319.2, 198, 584, 216.0, 584.0, 584.0, 584.0, 0.023006064398575464, 0.03565490644583912, 0.05174117803703056], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ce946b3e-2e10-44a0-bb5b-209497c27f93", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["addBook", 61, 6, 9.836065573770492, 964.4918032786887, 487, 1992, 840.0, 1614.4, 1837.1999999999998, 1992.0, 0.2912876346011508, 81.07630184084235, 1.062087205727861], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8d7b0482-4161-4963-b305-933cb6ced7b1", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.3868609475374732, 1.476345021413276], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 165.99999999999991, 96, 413, 103.0, 395.4, 402.79999999999995, 413.0, 0.23323565706725247, 0.17333235842595618, 0.11274575219559567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=87f32c2f-e6fa-48fa-992c-b8fa5b79fee5", 1, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 294.0, 3.401360544217687, 0.6145036139455783, 2.345078656462585], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 618.4000000000001, 464, 1010, 591.0, 794.6, 854.9999999999998, 1010.0, 0.23309331785028628, 68.53717487455341, 0.11722954950478265], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 145.83636363636367, 94, 393, 102.0, 302.2, 310.5999999999999, 393.0, 0.2335734184956173, 0.4133154631973228, 0.11359332266681388], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 949.7636363636362, 652, 1480, 934.0, 1233.0, 1345.3999999999996, 1480.0, 0.23277171865940421, 209.4484016187686, 0.11684049159270875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 107.15384615384616, 98, 144, 104.0, 131.6, 144.0, 144.0, 0.09193126370129412, 0.0686791179018457, 0.03267869139381939], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 6, 3.389830508474576, 159.33333333333331, 96, 539, 107.0, 296.80000000000007, 342.59999999999997, 493.75999999999993, 0.7168226532157799, 1.476137044746743, 0.3471081445430357], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 178.3846153846154, 98, 312, 106.0, 311.2, 312.0, 312.0, 0.06232381536809404, 0.04826443904970564, 0.02215416874412718], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 23, 0, 0.0, 107.30434782608695, 99, 149, 105.0, 116.60000000000001, 142.99999999999991, 149.0, 0.1076537107766045, 0.08736350942906089, 0.03826753000262113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 237.3076923076923, 198, 409, 207.0, 406.6, 409.0, 409.0, 0.06022561441708554, 0.09333793953116676, 0.1354488183618633], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a35f50bd-cf40-4d12-9cb1-fee4c62b7315", 1, 0, 0.0, 825.0, 825, 825, 825.0, 825.0, 825.0, 825.0, 1.2121212121212122, 0.21898674242424243, 0.8357007575757576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 357.06666666666666, 192, 1043, 208.0, 785.0000000000001, 1043.0, 1043.0, 0.13472005173249985, 10.939671659167251, 0.300690594631855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 107.88235294117646, 98, 126, 106.0, 118.0, 126.0, 126.0, 0.11850571267244324, 0.09825327154189874, 0.04212507755153256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ecfbd554-72b5-4d0e-a617-6fb28051df64", 3, 0, 0.0, 421.66666666666663, 211, 836, 218.0, 836.0, 836.0, 836.0, 0.03295580626380024, 0.02678732039085586, 0.02113376899078336], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 130.21428571428572, 97, 298, 102.5, 297.0, 298.0, 298.0, 0.08304761000842341, 0.06447543941083653, 0.029520830120181755], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/34251de9-3606-4e8e-bc6f-205700fbc908", 3, 0, 0.0, 338.3333333333333, 219, 459, 337.0, 459.0, 459.0, 459.0, 0.033003300330033, 0.03309998968646864, 0.021164225797579757], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ece8c5a4-948d-4cf7-b023-97cd725f577a", 1, 0, 0.0, 933.0, 933, 933, 933.0, 933.0, 933.0, 933.0, 1.0718113612004287, 0.19363779474812431, 0.7389636923901393], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/faf84bd1-b474-4219-af24-4cfac54f159b", 3, 0, 0.0, 282.0, 194, 455, 197.0, 455.0, 455.0, 455.0, 0.04707285308562552, 0.029282624429241656, 0.030186692896706467], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6ec0c7d1-4741-414d-b077-cd3952a67125", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.3988169150110375, 1.5219715783664458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6abb1905-1c08-4561-b695-64d4d49765be", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 114.23076923076921, 94, 284, 102.0, 214.79999999999995, 284.0, 284.0, 0.09557769363673124, 0.0710299070874536, 0.04797552200124987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 157.84615384615384, 93, 305, 100.0, 299.0, 305.0, 305.0, 0.09558472114995772, 0.036619747435756037, 0.053895651814271535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 236.38461538461542, 94, 1113, 104.0, 784.5999999999997, 1113.0, 1113.0, 0.09557699094224209, 6.639190483564434, 0.05555699788995413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 223.38461538461542, 92, 749, 102.0, 571.3999999999999, 749.0, 749.0, 0.09544296548635534, 2.1824691691689857, 0.0555722975874955], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 45.45454545454545, 0.3819709702062643], "isController": false}, {"data": ["401/Unauthorized", 6, 54.54545454545455, 0.45836516424751717], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1309, 11, "401/Unauthorized", 6, "406/Not Acceptable", 5, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
