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

    var data = {"OkPercent": 98.85321100917432, "KoPercent": 1.146788990825688};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7313531353135313, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dc1e52be-004e-414e-9e65-fdfb7d19a1f6"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f3906248-ae59-417e-b4a4-eb062951ff0d"], "isController": false}, {"data": [0.4583333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4583333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c07c0316-7c63-489f-b335-c094d6ef2911"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/2994771b-65ba-4d17-9bf5-eb16c5b9a2e4"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4eacd5ce-f535-490f-8931-ff1fd66951a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6292cecb-85f6-4d62-adbb-9893d1d75abd"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7045454545454546, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a172b118-8590-45fd-b75a-212645922def"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9406f1b5-1b75-43da-8989-5e493284c9d2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3b1bbe7d-b039-4000-a303-c27abc6a2977"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2994771b-65ba-4d17-9bf5-eb16c5b9a2e4"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0e943e3a-de9c-4163-b2d9-6845639796b9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd6d4075-ad48-41c0-b614-3fb27e435a17"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f3906248-ae59-417e-b4a4-eb062951ff0d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/10b4f4e8-4e8c-467b-b2e7-a0350cb9bd01"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/56f32743-5e66-4f74-a569-6c3f69caa137"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0e5b8d5b-d721-442f-9f3e-730910566109"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.20535714285714285, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fd6d4075-ad48-41c0-b614-3fb27e435a17"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=10b4f4e8-4e8c-467b-b2e7-a0350cb9bd01"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.20454545454545456, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c07c0316-7c63-489f-b335-c094d6ef2911"], "isController": false}, {"data": [0.288135593220339, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dc1e52be-004e-414e-9e65-fdfb7d19a1f6"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4eacd5ce-f535-490f-8931-ff1fd66951a0"], "isController": false}, {"data": [0.9017857142857143, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.33035714285714285, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9396551724137931, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/75875dee-3750-4099-8142-ec7ab5947f1c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6292cecb-85f6-4d62-adbb-9893d1d75abd"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0e943e3a-de9c-4163-b2d9-6845639796b9"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3b1bbe7d-b039-4000-a303-c27abc6a2977"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=56f32743-5e66-4f74-a569-6c3f69caa137"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9406f1b5-1b75-43da-8989-5e493284c9d2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1308, 15, 1.146788990825688, 496.3516819571855, 139, 4062, 157.5, 1413.1000000000001, 1702.0, 2301.55, 5.162431078782329, 739.946592994062, 3.7815823648019293], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2368.3571428571427, 1713, 3310, 2412.0, 2809.0000000000005, 2959.65, 3310.0, 0.24823355231078842, 298.7071033513192, 1.2205624373875192], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dc1e52be-004e-414e-9e65-fdfb7d19a1f6", 1, 0, 0.0, 313.0, 313, 313, 313.0, 313.0, 313.0, 313.0, 3.1948881789137378, 0.5772014776357828, 2.2027256389776357], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3906248-ae59-417e-b4a4-eb062951ff0d", 3, 0, 0.0, 463.3333333333333, 339, 567, 484.0, 567.0, 567.0, 567.0, 0.017785155323689825, 0.024518272394474745, 0.011405194006402655], "isController": false}, {"data": ["deleteBook", 12, 0, 0.0, 1035.8333333333333, 481, 4062, 584.5, 3380.4000000000024, 4062.0, 4062.0, 0.11336797354747284, 0.02048151865847898, 0.07705479452054795], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 1035.8333333333333, 481, 4062, 584.5, 3380.4000000000024, 4062.0, 4062.0, 0.11178492580275551, 0.02019551882178688, 0.07597881675656037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 174.3684210526316, 141, 426, 145.0, 424.0, 426.0, 426.0, 0.0995092622173806, 0.03449272534919895, 0.056311522256032094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 160.89473684210532, 142, 429, 146.0, 152.0, 429.0, 429.0, 0.0995066564715987, 0.0739497710692252, 0.04994767717422044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 269.2631578947368, 141, 1121, 145.0, 430.0, 1121.0, 1121.0, 0.09950978338291365, 1.5653662254629823, 0.058147960900511164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 255.7368421052631, 140, 1274, 145.0, 567.0, 1274.0, 1274.0, 0.09951030455390578, 4.738017232631524, 0.05805108741194647], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c07c0316-7c63-489f-b335-c094d6ef2911", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2994771b-65ba-4d17-9bf5-eb16c5b9a2e4", 3, 0, 0.0, 1140.0, 458, 2455, 507.0, 2455.0, 2455.0, 2455.0, 0.043818009201781936, 0.02817075786898415, 0.028099439494632294], "isController": false}, {"data": ["goToProfile", 12, 0, 0.0, 307.75, 228, 458, 287.5, 438.80000000000007, 458.0, 458.0, 0.11745360582569886, 0.28051989125753657, 0.07593192095372328], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 13, 0, 0.0, 144.30769230769232, 142, 148, 144.0, 147.6, 148.0, 148.0, 0.07442946948964285, 0.05531330691564278, 0.03736010480241839], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 13, 0, 0.0, 208.69230769230768, 141, 427, 145.0, 426.6, 427.0, 427.0, 0.0744303217680064, 0.0285152224321539, 0.04196769795602886], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 887.8571428571429, 833, 1148, 844.0, 1148.0, 1148.0, 1148.0, 0.10846491160109704, 31.892285384740532, 0.061858894897500655], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1599.7142857142856, 1531, 1719, 1560.0, 1719.0, 1719.0, 1719.0, 0.10700909577314072, 96.28697247859817, 0.060924123863028354], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 344.85714285714283, 142, 431, 422.0, 431.0, 431.0, 431.0, 0.10916009107070454, 0.19316219240245766, 0.06044313636434519], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4eacd5ce-f535-490f-8931-ff1fd66951a0", 1, 0, 0.0, 776.0, 776, 776, 776.0, 776.0, 776.0, 776.0, 1.288659793814433, 0.23281451353092783, 0.8884705219072164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 146.20000000000002, 142, 153, 145.5, 152.9, 153.0, 153.0, 0.12135333236250667, 0.09018543547643319, 0.06091368440852386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 172.0, 140, 419, 144.5, 391.80000000000007, 419.0, 419.0, 0.12135038710773487, 0.05069696836395408, 0.06818848900565493], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 285.1, 142, 1549, 144.0, 1409.4000000000005, 1549.0, 1549.0, 0.12135185971725017, 10.948698975335235, 0.0702987531096414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6292cecb-85f6-4d62-adbb-9893d1d75abd", 3, 0, 0.0, 806.6666666666667, 242, 1658, 520.0, 1658.0, 1658.0, 1658.0, 0.02020351675881715, 0.027852178865101117, 0.012956031254840426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 298.1000000000001, 142, 1128, 144.5, 1057.3000000000002, 1128.0, 1128.0, 0.1213489145339595, 3.597497595774631, 0.07041555177351438], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 182.28571428571428, 140, 423, 142.0, 423.0, 423.0, 423.0, 0.10965427573350878, 0.08149111702460955, 0.06157344584645268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 22, 0, 0.0, 791.0, 141, 2116, 289.0, 1763.6999999999998, 2073.9999999999995, 2116.0, 0.1081718949749238, 44.25829458710296, 0.05936777829678434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 13, 0, 0.0, 296.46153846153845, 140, 1702, 143.0, 1253.5999999999995, 1702.0, 1702.0, 0.07443117406588877, 5.170310737627249, 0.043265356439441655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 22, 0, 0.0, 609.9545454545456, 141, 1299, 148.0, 1247.0, 1297.05, 1299.0, 0.10817349061103271, 14.473447864065257, 0.05947429220118302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 13, 0, 0.0, 198.46153846153845, 141, 853, 144.0, 571.3999999999997, 853.0, 853.0, 0.07442946948964285, 1.7019590874088237, 0.043337050632077954], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 540.8333333333333, 246, 782, 539.5, 780.2, 782.0, 782.0, 0.1115677123040592, 0.02015627614868257, 0.07692070789713457], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 515.4, 285, 1703, 298.5, 1589.5000000000005, 1703.0, 1703.0, 0.12114017129220221, 14.66154524509685, 0.2693475996075058], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 619.0454545454546, 183, 1323, 573.0, 1124.1, 1299.1499999999996, 1323.0, 0.10851818419481973, 0.06665814243998204, 0.04906632742402494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 22, 0, 0.0, 144.8181818181818, 141, 156, 144.0, 147.7, 154.79999999999998, 156.0, 0.10817083124366955, 0.08038867439104738, 0.05429668677660757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 22, 0, 0.0, 210.3636363636364, 141, 443, 145.0, 434.4, 441.79999999999995, 443.0, 0.10817295872709928, 0.10279504174492816, 0.05756291855559599], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a172b118-8590-45fd-b75a-212645922def", 1, 0, 0.0, 644.0, 644, 644, 644.0, 644.0, 644.0, 644.0, 1.5527950310559004, 0.4958632569875776, 0.9265212538819876], "isController": false}, {"data": ["login", 22, 0, 0.0, 3321.0, 1971, 5191, 3277.0, 4459.9, 5093.3499999999985, 5191.0, 0.10735268284113755, 41.00933003843958, 0.21861291184392873], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9406f1b5-1b75-43da-8989-5e493284c9d2", 3, 0, 0.0, 372.3333333333333, 249, 522, 346.0, 522.0, 522.0, 522.0, 0.026526840741690465, 0.03135382771259052, 0.017011027428753326], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3b1bbe7d-b039-4000-a303-c27abc6a2977", 1, 0, 0.0, 533.0, 533, 533, 533.0, 533.0, 533.0, 533.0, 1.876172607879925, 0.3389569652908067, 1.2935330675422139], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 13, 0, 0.0, 178.0, 143, 499, 150.0, 366.9999999999999, 499.0, 499.0, 0.0687325194698079, 0.05564380726608473, 0.024432262780283282], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2994771b-65ba-4d17-9bf5-eb16c5b9a2e4", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 22, 0, 0.0, 937.8636363636363, 286, 2260, 436.0, 1906.6, 2217.6999999999994, 2260.0, 0.10809323532879997, 58.87187128429504, 0.2305330071292402], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0e943e3a-de9c-4163-b2d9-6845639796b9", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 0.7344067581300813, 2.802654979674797], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd6d4075-ad48-41c0-b614-3fb27e435a17", 1, 0, 0.0, 605.0, 605, 605, 605.0, 605.0, 605.0, 605.0, 1.6528925619834711, 0.29861828512396693, 1.1395919421487604], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f3906248-ae59-417e-b4a4-eb062951ff0d", 1, 0, 0.0, 782.0, 782, 782, 782.0, 782.0, 782.0, 782.0, 1.278772378516624, 0.23102821291560102, 0.8816536125319693], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/10b4f4e8-4e8c-467b-b2e7-a0350cb9bd01", 3, 0, 0.0, 457.0, 272, 705, 394.0, 705.0, 705.0, 705.0, 0.051842123453376646, 0.03393701506013686, 0.03324511171977604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 477.2105263157895, 288, 1419, 295.0, 860.0, 1419.0, 1419.0, 0.09943114916242339, 6.40673693461617, 0.22228401690067875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 0, 0.0, 1782.2857142857144, 1673, 2143, 1706.0, 2143.0, 2143.0, 2143.0, 0.10677730829659686, 127.74278252131732, 0.2407703172430099], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/56f32743-5e66-4f74-a569-6c3f69caa137", 3, 0, 0.0, 1469.6666666666667, 357, 3654, 398.0, 3654.0, 3654.0, 3654.0, 0.021072891130420122, 0.02490744391098811, 0.013513540210588426], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 1243.545454545455, 233, 3128, 1284.0, 2124.3999999999996, 3011.2999999999984, 3128.0, 0.10796804145972792, 0.03379752434188571, 0.04871214370546318], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0e5b8d5b-d721-442f-9f3e-730910566109", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 0.8043726385390427, 1.5029715050377832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 0, 0.0, 486.46153846153845, 286, 1846, 292.0, 1397.9999999999995, 1846.0, 1846.0, 0.07436730584412612, 6.950169972198069, 0.16579015441226946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 166.33333333333331, 144, 433, 147.0, 263.80000000000007, 433.0, 433.0, 0.10030828078293957, 0.0778760578344111, 0.035656459184560556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 536.3888888888889, 289, 1829, 568.0, 949.7000000000014, 1829.0, 1829.0, 0.07966434754899357, 5.411397029128383, 0.17803460309451732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 166.8461538461538, 142, 425, 145.0, 316.19999999999993, 425.0, 425.0, 0.06243726255829479, 0.0464011296942015, 0.031340579057581565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 209.46153846153848, 141, 434, 144.0, 430.8, 434.0, 434.0, 0.06235370860673036, 0.016684488435785273, 0.03556109943977591], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 144.69230769230768, 142, 149, 144.0, 148.2, 149.0, 149.0, 0.06243756243756244, 0.016828874250749252, 0.036706457604895104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 165.46153846153842, 139, 425, 144.0, 314.19999999999993, 425.0, 425.0, 0.06243756243756244, 0.016828874250749252, 0.03676743178696304], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1651.3392857142858, 1121, 2649, 1626.0, 2199.7000000000007, 2330.5, 2649.0, 0.24718277842270903, 295.716537631371, 0.488089431612029], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd6d4075-ad48-41c0-b614-3fb27e435a17", 3, 0, 0.0, 435.6666666666667, 312, 526, 469.0, 526.0, 526.0, 526.0, 0.031067156837363434, 0.0311581738984104, 0.019922623362501942], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 1243.545454545455, 233, 3128, 1284.0, 2124.3999999999996, 3011.2999999999984, 3128.0, 0.10842940013898678, 0.0339419446812915, 0.04892029576583193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 145.0, 142, 152, 144.0, 152.0, 152.0, 152.0, 0.03103007434805814, 0.008363574726625045, 0.018272592609256892], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=10b4f4e8-4e8c-467b-b2e7-a0350cb9bd01", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 145.4, 142, 153, 144.0, 153.0, 153.0, 153.0, 0.03103007434805814, 0.008363574726625045, 0.01824228980227637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 313.4666666666667, 142, 1560, 146.0, 880.2000000000004, 1560.0, 1560.0, 0.09803921568627451, 5.905720230800654, 0.057074652777777776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 285.73333333333335, 142, 1138, 145.0, 714.4000000000003, 1138.0, 1138.0, 0.09785629476925485, 1.9428169606161032, 0.057063726057826544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 146.0, 142, 149, 146.0, 149.0, 149.0, 149.0, 0.031028918952463694, 0.008302659954077201, 0.01769618034007695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 202.33333333333334, 142, 433, 146.0, 428.8, 433.0, 433.0, 0.09803729338640418, 0.07285779322954453, 0.04921012578184742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 148.2, 145, 156, 146.0, 156.0, 156.0, 156.0, 0.031027378558840323, 0.023058432698513168, 0.015574289628167896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 182.0, 142, 437, 144.0, 427.4, 437.0, 437.0, 0.0980379341446517, 0.036049365367772965, 0.05536334900850969], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 207.4, 145, 445, 149.0, 445.0, 445.0, 445.0, 0.031571237339933826, 0.024850016890611976, 0.0112225882731796], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 964.75, 484, 3654, 547.5, 3055.200000000002, 3654.0, 3654.0, 0.11505824823817057, 0.020786890550841364, 0.07831601466992665], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1713.909090909091, 1105, 2897, 1612.0, 2600.2999999999997, 2864.1499999999996, 2897.0, 0.11033597303790041, 0.057107486045007046, 0.050750237598487395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 295.8, 289, 310, 293.0, 310.0, 310.0, 310.0, 0.03099871665313056, 0.048041956375506054, 0.06971684028531219], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c07c0316-7c63-489f-b335-c094d6ef2911", 3, 0, 0.0, 618.3333333333333, 228, 1200, 427.0, 1200.0, 1200.0, 1200.0, 0.028518736810084225, 0.023774897451375555, 0.018288382654904272], "isController": false}, {"data": ["addBook", 59, 8, 13.559322033898304, 1405.8305084745766, 723, 4172, 1139.0, 2473.0, 2602.0, 4172.0, 0.27738077328117944, 85.45549489401938, 1.0086318972022152], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/dc1e52be-004e-414e-9e65-fdfb7d19a1f6", 3, 0, 0.0, 411.0, 263, 498, 472.0, 498.0, 498.0, 498.0, 0.08392312641620275, 0.03895650334293787, 0.053817890312473776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4eacd5ce-f535-490f-8931-ff1fd66951a0", 3, 0, 0.0, 729.0, 368, 1091, 728.0, 1091.0, 1091.0, 1091.0, 0.01735317765604845, 0.023922756306433982, 0.011128177077609195], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 264.62500000000006, 142, 783, 146.0, 576.3, 593.4499999999999, 783.0, 0.24841744777688562, 0.18461491968575194, 0.12008460610308437], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 949.6250000000001, 701, 1413, 852.5, 1259.1000000000001, 1279.75, 1413.0, 0.2485376223825882, 73.0783132062241, 0.12499694875686806], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 227.21428571428572, 141, 440, 148.0, 432.0, 434.3, 440.0, 0.2491601966585838, 0.4408967542435096, 0.12117361126560032], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1382.535714285714, 974, 1879, 1347.5, 1731.6, 1782.25, 1879.0, 0.24808069710675884, 223.22344733601201, 0.12452488116491607], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 152.2777777777778, 144, 214, 148.0, 163.60000000000008, 214.0, 214.0, 0.0798541331168399, 0.059656652182014186, 0.028385648881376686], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 8, 4.597701149425287, 216.2758620689655, 141, 1881, 150.5, 351.0, 470.25, 987.75, 0.7152899390770293, 1.5505415674921277, 0.34381095637142456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 175.92307692307693, 144, 433, 149.0, 331.3999999999999, 433.0, 433.0, 0.06392792863676151, 0.04950668692280456, 0.022724380882598816], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/75875dee-3750-4099-8142-ec7ab5947f1c", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 1.27734375, 2.38671875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 166.47368421052633, 144, 484, 148.0, 158.0, 484.0, 484.0, 0.09535471955675112, 0.07738258979654314, 0.03389562296743887], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6292cecb-85f6-4d62-adbb-9893d1d75abd", 1, 0, 0.0, 690.0, 690, 690, 690.0, 690.0, 690.0, 690.0, 1.4492753623188406, 0.26183197463768115, 0.9992074275362319], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e943e3a-de9c-4163-b2d9-6845639796b9", 3, 0, 0.0, 453.6666666666667, 240, 589, 532.0, 589.0, 589.0, 589.0, 0.06822368271439293, 0.03086943976985878, 0.043750213199008486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 378.2307692307692, 289, 850, 292.0, 741.5999999999999, 850.0, 850.0, 0.06230977544515541, 0.09656798206197427, 0.14013614536151653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 575.0666666666666, 287, 1986, 568.0, 1317.0000000000005, 1986.0, 1986.0, 0.09776317847645861, 7.938662872640649, 0.21820410466851767], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b1bbe7d-b039-4000-a303-c27abc6a2977", 3, 0, 0.0, 390.0, 243, 563, 364.0, 563.0, 563.0, 563.0, 0.0278955590270029, 0.027977284297589826, 0.017888753672915272], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 174.7, 144, 434, 146.0, 405.60000000000014, 434.0, 434.0, 0.12484082794437092, 0.1035057255124716, 0.0443770130583506], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=56f32743-5e66-4f74-a569-6c3f69caa137", 1, 0, 0.0, 588.0, 588, 588, 588.0, 588.0, 588.0, 588.0, 1.7006802721088434, 0.30725180697278914, 1.1725393282312926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 22, 0, 0.0, 173.9090909090909, 143, 429, 147.0, 346.1999999999998, 428.09999999999997, 429.0, 0.1052133200063128, 0.08168416934083855, 0.037400047345994], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9406f1b5-1b75-43da-8989-5e493284c9d2", 1, 0, 0.0, 546.0, 546, 546, 546.0, 546.0, 546.0, 546.0, 1.8315018315018314, 0.3308865613553113, 1.262734661172161], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 177.1111111111111, 143, 427, 146.0, 424.3, 427.0, 427.0, 0.07981412177861336, 0.05931498698586403, 0.040062947845905535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 239.33333333333337, 141, 433, 147.0, 428.5, 433.0, 433.0, 0.07981482959533881, 0.02801659871320758, 0.04514699508251967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 263.2777777777778, 140, 1405, 144.0, 531.1000000000014, 1405.0, 1405.0, 0.07981518350840942, 4.0101976714474485, 0.04654153604320662], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 330.3888888888889, 140, 1254, 284.5, 515.1000000000012, 1254.0, 1254.0, 0.07971585725547162, 1.3224649665414834, 0.046561464801020365], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 46.666666666666664, 0.5351681957186545], "isController": false}, {"data": ["401/Unauthorized", 8, 53.333333333333336, 0.6116207951070336], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1308, 15, "401/Unauthorized", 8, "406/Not Acceptable", 7, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
