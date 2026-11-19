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

    var data = {"OkPercent": 98.2874162323157, "KoPercent": 1.712583767684289};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8185897435897436, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/04b6e4ae-bc0e-4573-889f-b72cfd950917"], "isController": false}, {"data": [0.4661016949152542, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fa56a0e8-5f0e-4b25-b585-0b1dde8e1e2e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/80e529e9-ac46-420a-aca0-0104d41a6cca"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/07e5a6ea-17e3-48bb-824e-43cc6b6d2692"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/51304a95-7831-4a6f-acf4-f9887bace4b5"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/226149b9-4577-491f-ac18-b35f72734741"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/04c8d9a2-f8dc-4455-853c-746ad18f9929"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9274ab63-3767-44ea-8143-61a004e4cb19"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=93871fc9-41b6-4195-989b-7bc7d62c8a4a"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9fc455d8-0463-4524-ab87-52030e6b11f4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/08069092-1a2d-42a5-b7b5-f327f1ba0319"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e82ab1ee-b84a-49c8-9222-cf8b65effb17"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/646d10cf-fe19-4a60-b116-0e5002ad0688"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/66d6f096-248d-440e-99eb-f96f790c19f7"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4703b356-e54b-4806-a4f5-70b53df732be"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f596b98e-2c27-427e-9794-0c2bcf11bdd7"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0764b061-bf95-403e-8f15-71ac698b0401"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=80e529e9-ac46-420a-aca0-0104d41a6cca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.38636363636363635, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=07e5a6ea-17e3-48bb-824e-43cc6b6d2692"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/93871fc9-41b6-4195-989b-7bc7d62c8a4a"], "isController": false}, {"data": [0.3983050847457627, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e82ab1ee-b84a-49c8-9222-cf8b65effb17"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fa56a0e8-5f0e-4b25-b585-0b1dde8e1e2e"], "isController": false}, {"data": [0.8305084745762712, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9350282485875706, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=226149b9-4577-491f-ac18-b35f72734741"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=04c8d9a2-f8dc-4455-853c-746ad18f9929"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9fc455d8-0463-4524-ab87-52030e6b11f4"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0764b061-bf95-403e-8f15-71ac698b0401"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=08069092-1a2d-42a5-b7b5-f327f1ba0319"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4703b356-e54b-4806-a4f5-70b53df732be"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1343, 23, 1.712583767684289, 279.084884586746, 82, 2734, 94.0, 672.0, 832.0, 1377.359999999997, 5.227389496956204, 748.4606319526616, 3.8198700827799748], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/04b6e4ae-bc0e-4573-889f-b72cfd950917", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 1.7355213994565217, 3.2428243885869565], "isController": false}, {"data": ["see books", 59, 0, 0.0, 1219.3389830508474, 1005, 1595, 1186.0, 1477.0, 1521.0, 1595.0, 0.26068821689259647, 313.6974415688349, 1.2818019258342022], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fa56a0e8-5f0e-4b25-b585-0b1dde8e1e2e", 3, 0, 0.0, 372.3333333333333, 180, 529, 408.0, 529.0, 529.0, 529.0, 0.0169407300325262, 0.020023369384147994, 0.010863684298202024], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/80e529e9-ac46-420a-aca0-0104d41a6cca", 3, 0, 0.0, 349.3333333333333, 274, 423, 351.0, 423.0, 423.0, 423.0, 0.027694949364400912, 0.027776086911366932, 0.017760107502561785], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 427.57142857142856, 86, 806, 458.0, 748.0, 806.0, 806.0, 0.06819886789879288, 0.013990853131302305, 0.045654613227170425], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 427.57142857142856, 86, 806, 458.0, 748.0, 806.0, 806.0, 0.06833568440628493, 0.01401892074769001, 0.045746202793465154], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/07e5a6ea-17e3-48bb-824e-43cc6b6d2692", 3, 0, 0.0, 787.0, 179, 1796, 386.0, 1796.0, 1796.0, 1796.0, 0.03072857450142888, 0.03081859962203853, 0.019705498622335574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 104.47058823529412, 83, 250, 85.0, 249.2, 250.0, 250.0, 0.07800061482837571, 0.027762626923059277, 0.0440993825333682], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 97.11764705882352, 84, 253, 86.0, 137.7999999999999, 253.0, 253.0, 0.07800204640662926, 0.05796831769086412, 0.039153370950202576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 168.70588235294122, 84, 669, 86.0, 336.9999999999997, 669.0, 669.0, 0.07800097271801272, 1.3688973558817321, 0.045537907038899546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 172.94117647058823, 82, 739, 86.0, 355.79999999999967, 739.0, 739.0, 0.07800133061093395, 4.148359713746587, 0.04546194280667141], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/51304a95-7831-4a6f-acf4-f9887bace4b5", 1, 0, 0.0, 330.0, 330, 330, 330.0, 330.0, 330.0, 330.0, 3.0303030303030303, 0.9676846590909091, 1.8081202651515151], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 205.92857142857144, 84, 351, 193.0, 324.5, 351.0, 351.0, 0.06857198834276199, 0.12321529155340044, 0.0443163694193422], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 22, 0, 0.0, 100.95454545454545, 84, 257, 85.0, 201.8999999999999, 255.79999999999998, 257.0, 0.11769804032762855, 0.08746895379816925, 0.05907889914882917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 22, 0, 0.0, 137.3181818181818, 82, 254, 85.0, 252.4, 253.85, 254.0, 0.11759109300920953, 0.04752083233113652, 0.0661658689180016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 514.4, 416, 583, 575.0, 583.0, 583.0, 583.0, 0.043857340841710085, 12.8955144082329, 0.025012389698787784], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 691.0, 579, 800, 745.0, 800.0, 800.0, 800.0, 0.04379204035874439, 39.40415489299415, 0.024932382352683576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 85.8, 84, 90, 85.0, 90.0, 90.0, 90.0, 0.0440462661980144, 0.07794124448320516, 0.024388899349877112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 86.0, 84, 91, 85.5, 88.2, 91.0, 91.0, 0.10059666396313133, 0.07475982546478803, 0.050494809840868654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 105.56250000000001, 83, 251, 85.0, 250.3, 251.0, 251.0, 0.10059919394895848, 0.026918143693373656, 0.05737297779901539], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/226149b9-4577-491f-ac18-b35f72734741", 3, 0, 0.0, 818.6666666666666, 192, 1317, 947.0, 1317.0, 1317.0, 1317.0, 0.07427948895711597, 0.033609534391403385, 0.04763365665544221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 106.25000000000001, 83, 254, 85.5, 251.9, 254.0, 254.0, 0.10059792894013794, 0.027114285534646555, 0.05914057931832328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 95.875, 83, 255, 85.0, 138.80000000000013, 255.0, 255.0, 0.10059919394895848, 0.027114626494055216, 0.059239564405490205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 85.6, 84, 87, 86.0, 87.0, 87.0, 87.0, 0.044047042241113506, 0.03273417885301502, 0.02473344657093776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 570.3846153846154, 84, 759, 744.0, 757.0, 759.0, 759.0, 0.0676456202062671, 46.825475194220985, 0.03529646018274724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 22, 0, 0.0, 167.27272727272728, 83, 746, 85.0, 482.9999999999998, 721.3999999999996, 746.0, 0.11769804032762855, 9.656557870655202, 0.06827405854942514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 442.3846153846154, 83, 669, 420.0, 668.2, 669.0, 669.0, 0.0676456202062671, 15.304252437844083, 0.03536252035872993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 22, 0, 0.0, 168.04545454545453, 83, 586, 85.0, 481.7999999999998, 584.9499999999999, 586.0, 0.1175917215428034, 3.1720742711985803, 0.06832722101364064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/04c8d9a2-f8dc-4455-853c-746ad18f9929", 3, 0, 0.0, 267.3333333333333, 178, 420, 204.0, 420.0, 420.0, 420.0, 0.019853744085238743, 0.02736998899771682, 0.012731730419244898], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 342.53846153846155, 86, 685, 404.0, 600.1999999999999, 685.0, 685.0, 0.07035012717138374, 0.0139463631013583, 0.047731546620488126], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 203.625, 170, 342, 173.0, 339.9, 342.0, 342.0, 0.10054230003079108, 0.1558209278797514, 0.2261219892294061], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9274ab63-3767-44ea-8143-61a004e4cb19", 1, 0, 0.0, 347.0, 347, 347, 347.0, 347.0, 347.0, 347.0, 2.881844380403458, 0.9202764769452451, 1.7195380043227666], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 396.2272727272727, 95, 1166, 297.0, 927.1999999999998, 1146.1999999999998, 1166.0, 0.09739469198928659, 0.05982545045045045, 0.0440368578037497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 98.46153846153848, 84, 252, 86.0, 186.39999999999995, 252.0, 252.0, 0.06764421225713126, 0.050270747585621965, 0.03395422373063034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 182.53846153846152, 83, 340, 252.0, 308.4, 340.0, 340.0, 0.06764597220270896, 0.09625525882389672, 0.03420918606284831], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=93871fc9-41b6-4195-989b-7bc7d62c8a4a", 1, 0, 0.0, 685.0, 685, 685, 685.0, 685.0, 685.0, 685.0, 1.4598540145985401, 0.26374315693430656, 1.006500912408759], "isController": false}, {"data": ["login", 22, 0, 0.0, 2239.727272727273, 1245, 4308, 2112.5, 3563.7999999999993, 4238.399999999999, 4308.0, 0.09619757232308392, 26.288467584970878, 0.18139528019729248], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9fc455d8-0463-4524-ab87-52030e6b11f4", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 0.9264823717948718, 3.535657051282051], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 22, 0, 0.0, 105.0, 85, 312, 87.0, 204.3999999999999, 303.14999999999986, 312.0, 0.11615812288473419, 0.09403816784320766, 0.041290582744182854], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/08069092-1a2d-42a5-b7b5-f327f1ba0319", 3, 0, 0.0, 333.3333333333333, 217, 485, 298.0, 485.0, 485.0, 485.0, 0.02547597615448632, 0.025550612803376418, 0.016337133145943376], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e82ab1ee-b84a-49c8-9222-cf8b65effb17", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/646d10cf-fe19-4a60-b116-0e5002ad0688", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 1.6460615335051545, 3.0756684922680413], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/66d6f096-248d-440e-99eb-f96f790c19f7", 1, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 215.0, 4.651162790697675, 1.4852834302325582, 2.7752543604651163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 677.0769230769231, 170, 844, 831.0, 843.6, 844.0, 844.0, 0.06761430718740084, 62.24742663360067, 0.1387586582070766], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4703b356-e54b-4806-a4f5-70b53df732be", 3, 0, 0.0, 506.3333333333333, 271, 836, 412.0, 836.0, 836.0, 836.0, 0.017319416220210604, 0.023876213441598928, 0.011106526677674117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 310.6470588235294, 170, 825, 338.0, 568.1999999999998, 825.0, 825.0, 0.07796984860089987, 5.600732601257608, 0.17418252770222858], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 5, 50.0, 442.9, 84, 887, 435.5, 881.5, 887.0, 887.0, 0.07254156631749993, 43.402171690472386, 0.10569532904854481], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f596b98e-2c27-427e-9794-0c2bcf11bdd7", 1, 0, 0.0, 348.0, 348, 348, 348.0, 348.0, 348.0, 348.0, 2.8735632183908044, 0.9176320043103449, 1.7145968031609196], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 829.5652173913046, 223, 1880, 719.0, 1568.8, 1819.1999999999991, 1880.0, 0.0958353299027063, 0.030192686305964708, 0.04323820548344757], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 96.57894736842105, 85, 251, 87.0, 94.0, 251.0, 251.0, 0.10040478983692148, 0.0779509842972193, 0.035690765137343185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 22, 0, 0.0, 307.90909090909093, 170, 832, 256.0, 623.7999999999998, 808.1499999999996, 832.0, 0.11753769220083986, 12.9488679317106, 0.26161110450703623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 279.0, 170, 843, 174.0, 592.5, 843.0, 843.0, 0.07910230187698462, 6.873397427974529, 0.17645728334444533], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 124.44444444444444, 84, 253, 86.0, 253.0, 253.0, 253.0, 0.0461711307309916, 0.034312725084262315, 0.02317574335520477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 121.2222222222222, 84, 250, 84.0, 250.0, 250.0, 250.0, 0.04613255420575119, 0.012344062355835768, 0.026309972320467476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 158.66666666666666, 83, 256, 85.0, 256.0, 256.0, 256.0, 0.04613279067502525, 0.012434228736627898, 0.027121035142934763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 121.66666666666666, 83, 257, 84.0, 257.0, 257.0, 257.0, 0.04617207820524002, 0.012444817953756099, 0.027189221833749735], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 87.0, 86, 88, 87.0, 88.0, 88.0, 88.0, 0.03323031934336889, 0.009800348087595123, 0.020541789203469246], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 784.3898305084747, 660, 1243, 676.0, 1091.0, 1171.0, 1243.0, 0.25789305743147256, 308.52975482128886, 0.5092380489515992], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 829.5652173913046, 223, 1880, 719.0, 1568.8, 1819.1999999999991, 1880.0, 0.09422059088600128, 0.029683966727841776, 0.042509680653645104], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0764b061-bf95-403e-8f15-71ac698b0401", 1, 0, 0.0, 181.0, 181, 181, 181.0, 181.0, 181.0, 181.0, 5.524861878453039, 0.9981439917127072, 3.8091332872928176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 125.75, 82, 251, 85.0, 251.0, 251.0, 251.0, 0.04714951701213511, 0.01270826825717704, 0.027764803474919404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 126.25, 83, 252, 85.0, 252.0, 252.0, 252.0, 0.04714951701213511, 0.01270826825717704, 0.02771875902471224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 158.3684210526316, 83, 746, 85.0, 656.0, 746.0, 746.0, 0.0987813500811047, 9.37999390090151, 0.05717904834567234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 136.89473684210526, 83, 583, 84.0, 419.0, 583.0, 583.0, 0.09878032295966643, 3.081158108304826, 0.05727491896114294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 105.25, 83, 252, 84.5, 252.0, 252.0, 252.0, 0.04714979489839219, 0.012616253713046349, 0.026890117402989296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 94.00000000000001, 84, 253, 85.0, 87.0, 253.0, 253.0, 0.09878032295966643, 0.07340998610576772, 0.049583091798113814], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=80e529e9-ac46-420a-aca0-0104d41a6cca", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 85.75, 85, 87, 86.0, 87.0, 87.0, 87.0, 0.04714896124944747, 0.035039413584794454, 0.02366656843966406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 145.89473684210526, 84, 255, 85.0, 254.0, 255.0, 255.0, 0.09869617162744793, 0.04201283374889616, 0.055415140771907956], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 509.3846153846155, 84, 1317, 477.0, 1096.9999999999998, 1317.0, 1317.0, 0.07075523044434284, 0.013729023455358893, 0.048149912304334574], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 87.5, 87, 89, 87.0, 89.0, 89.0, 89.0, 0.04684087569017103, 0.03686889238894321, 0.016650467530490484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1223.7727272727273, 768, 2734, 1115.0, 1920.8, 2616.249999999998, 2734.0, 0.09391876027236441, 0.048610295844094854, 0.04319896102371448], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 233.625, 170, 339, 172.0, 339.0, 339.0, 339.0, 0.047125353440150806, 0.07303509366163996, 0.10598602438737041], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=07e5a6ea-17e3-48bb-824e-43cc6b6d2692", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.4143671158256881, 1.581314506880734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/93871fc9-41b6-4195-989b-7bc7d62c8a4a", 3, 0, 0.0, 617.6666666666666, 218, 868, 767.0, 868.0, 868.0, 868.0, 0.05278066116574887, 0.03393287949295378, 0.03384697346892099], "isController": false}, {"data": ["addBook", 59, 7, 11.864406779661017, 925.4576271186442, 433, 3029, 740.0, 1445.0, 1921.0, 3029.0, 0.2691372554386253, 88.38612514768337, 0.9774133543397242], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e82ab1ee-b84a-49c8-9222-cf8b65effb17", 3, 0, 0.0, 358.6666666666667, 194, 614, 268.0, 614.0, 614.0, 614.0, 0.027490905092231985, 0.027571444853244385, 0.01762925879938054], "isController": false}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 142.2881355932203, 83, 394, 86.0, 339.0, 356.0, 394.0, 0.2585508008501501, 0.192145663522426, 0.12498305314533623], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fa56a0e8-5f0e-4b25-b585-0b1dde8e1e2e", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 483.6610169491525, 411, 703, 422.0, 588.0, 657.0, 703.0, 0.25833344279665654, 75.95860965980988, 0.1299235576565216], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 132.61016949152537, 83, 384, 87.0, 259.0, 266.0, 384.0, 0.25889683619290005, 0.45812604216946773, 0.12590881291412526], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 636.915254237288, 573, 883, 583.0, 757.0, 841.0, 883.0, 0.2583368362056887, 232.45193932559857, 0.12967298223605858], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 90.28571428571429, 86, 99, 88.5, 97.5, 99.0, 99.0, 0.07662625543909582, 0.05724520059659013, 0.027238239238116087], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 7, 3.9548022598870056, 173.5706214689266, 84, 2521, 89.0, 283.6, 357.0999999999998, 2122.4199999999996, 0.7392186834389957, 1.6520995951002748, 0.353454431292338], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 86.88888888888889, 85, 90, 87.0, 90.0, 90.0, 90.0, 0.0490733319156593, 0.03800307832921663, 0.01744403595439452], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=226149b9-4577-491f-ac18-b35f72734741", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 208.0, 4.807692307692308, 0.8685772235576924, 3.3146784855769234], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=04c8d9a2-f8dc-4455-853c-746ad18f9929", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 88.47058823529412, 85, 116, 87.0, 95.19999999999999, 116.0, 116.0, 0.07628894662915046, 0.06191026821174222, 0.027118336497080828], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9fc455d8-0463-4524-ab87-52030e6b11f4", 3, 0, 0.0, 354.3333333333333, 268, 504, 291.0, 504.0, 504.0, 504.0, 0.07247252083584975, 0.032791928372991906, 0.04647489129121874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 302.77777777777777, 170, 512, 334.0, 512.0, 512.0, 512.0, 0.046111990654636566, 0.07146457926651194, 0.1037069477320586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 288.2105263157894, 170, 832, 172.0, 741.0, 832.0, 832.0, 0.09865261299618369, 12.560253340883719, 0.21921507080921104], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0764b061-bf95-403e-8f15-71ac698b0401", 3, 0, 0.0, 932.3333333333334, 278, 2042, 477.0, 2042.0, 2042.0, 2042.0, 0.04924491135915955, 0.02228203997045305, 0.03157958182862771], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=08069092-1a2d-42a5-b7b5-f327f1ba0319", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 0.44718827351485146, 1.7065671410891088], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 118.68750000000001, 85, 257, 87.0, 254.9, 257.0, 257.0, 0.09956316660651393, 0.08254797700090852, 0.03539159437965925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4703b356-e54b-4806-a4f5-70b53df732be", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 88.99999999999999, 86, 105, 87.0, 99.8, 105.0, 105.0, 0.07116502622157504, 0.05525019125600797, 0.025296942914700502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 85.42857142857143, 84, 88, 85.0, 87.5, 88.0, 88.0, 0.07921419518377693, 0.058869143100443604, 0.039761812816856784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 96.00000000000001, 83, 250, 84.0, 168.0, 250.0, 250.0, 0.07914254703328509, 0.029667414045540887, 0.044661216901456226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 168.35714285714286, 83, 759, 85.0, 506.0, 759.0, 759.0, 0.07921643627886449, 5.111189684110315, 0.046084338627631824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 174.14285714285717, 84, 672, 85.0, 463.0, 672.0, 672.0, 0.07921688451309906, 1.683568773694336, 0.046161959627680646], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 26.08695652173913, 0.4467609828741623], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 13.043478260869565, 0.22338049143708116], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.695652173913043, 0.14892032762472077], "isController": false}, {"data": ["401/Unauthorized", 12, 52.17391304347826, 0.8935219657483247], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1343, 23, "401/Unauthorized", 12, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
