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

    var data = {"OkPercent": 97.7726574500768, "KoPercent": 2.227342549923195};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8304749340369393, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a3f22d1f-4a38-4d8e-ba8d-557ee7264e8b"], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "see books"], "isController": true}, {"data": [0.75, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=88df511d-3838-4797-8cce-e56fdcc3c361"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=94de8e59-4843-4917-970f-cbff5579221f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6f696d4f-92fe-4fa6-b143-a879c6608589"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/774be447-d9d3-44fe-b12b-cea4a04b3b1c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2a3e93ec-b127-482a-b41b-4baf74223f1f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.09523809523809523, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eb3bf0f2-c860-4c7b-ab87-93714501af30"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a48d09d6-fe22-45fe-8b89-1205346bd7fc"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/33671b42-df32-496b-8a94-7d195cc09dd3"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a3f22d1f-4a38-4d8e-ba8d-557ee7264e8b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=528f3666-c21d-469a-9b5e-153537f98b3e"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bd10d855-585e-4177-863b-5e2fdfc175c3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/17629bf8-ab28-4f8b-a8bb-4d7be15d405c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8f555e9-d262-4927-b7f1-ad3ac089b3d4"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/528f3666-c21d-469a-9b5e-153537f98b3e"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/94de8e59-4843-4917-970f-cbff5579221f"], "isController": false}, {"data": [0.3983050847457627, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=774be447-d9d3-44fe-b12b-cea4a04b3b1c"], "isController": false}, {"data": [0.8909090909090909, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2a3e93ec-b127-482a-b41b-4baf74223f1f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9219653179190751, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59cb3564-aec1-4ca2-839e-68338ad1772f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/59cb3564-aec1-4ca2-839e-68338ad1772f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6f696d4f-92fe-4fa6-b143-a879c6608589"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c8f555e9-d262-4927-b7f1-ad3ac089b3d4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a48d09d6-fe22-45fe-8b89-1205346bd7fc"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/eb3bf0f2-c860-4c7b-ab87-93714501af30"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/88df511d-3838-4797-8cce-e56fdcc3c361"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=33671b42-df32-496b-8a94-7d195cc09dd3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1302, 29, 2.227342549923195, 256.296466973886, 76, 1417, 97.5, 639.1000000000001, 793.5499999999997, 1113.94, 5.042055857614201, 707.4677586280341, 3.692178339006614], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a3f22d1f-4a38-4d8e-ba8d-557ee7264e8b", 1, 0, 0.0, 941.0, 941, 941, 941.0, 941.0, 941.0, 941.0, 1.0626992561105206, 0.19199156482465463, 0.7326813230605739], "isController": false}, {"data": ["see books", 55, 0, 0.0, 1180.1818181818182, 947, 1523, 1217.0, 1360.6, 1410.7999999999997, 1523.0, 0.24307780699622125, 292.5048693249619, 1.1952116779550528], "isController": true}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 400.5714285714285, 83, 855, 391.0, 694.0, 855.0, 855.0, 0.08846202451661822, 0.01742583407051687, 0.05952181141791988], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 400.5714285714285, 83, 855, 391.0, 694.0, 855.0, 855.0, 0.08818842086034104, 0.017371937814564947, 0.05933771677028806], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=88df511d-3838-4797-8cce-e56fdcc3c361", 1, 0, 0.0, 378.0, 378, 378, 378.0, 378.0, 378.0, 378.0, 2.6455026455026456, 0.4779472552910053, 1.823950066137566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 168.11111111111114, 78, 244, 234.0, 242.2, 244.0, 244.0, 0.11438521126313046, 0.04969600541423334, 0.06416791907881776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 81.27777777777779, 78, 85, 81.0, 83.2, 85.0, 85.0, 0.11449871825045958, 0.08509133260605443, 0.05747298943431273], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 184.05555555555554, 78, 537, 156.0, 409.2000000000002, 537.0, 537.0, 0.11439029970258523, 3.7645778124126186, 0.06626842557640002], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 167.33333333333337, 78, 722, 81.0, 560.0000000000002, 722.0, 722.0, 0.1145009032849037, 11.475000735509274, 0.0662206829978881], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=94de8e59-4843-4917-970f-cbff5579221f", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f696d4f-92fe-4fa6-b143-a879c6608589", 3, 0, 0.0, 282.0, 231, 347, 268.0, 347.0, 347.0, 347.0, 0.030588835075197555, 0.03067845080295692, 0.01961588707621718], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 182.3571428571428, 81, 260, 178.5, 259.0, 260.0, 260.0, 0.08777539530276242, 0.16891987869753855, 0.05673317612133068], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/774be447-d9d3-44fe-b12b-cea4a04b3b1c", 3, 0, 0.0, 495.6666666666667, 167, 866, 454.0, 866.0, 866.0, 866.0, 0.025896001657344108, 0.025971868849699608, 0.01660648543781507], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 82.26315789473682, 79, 92, 82.0, 84.0, 92.0, 92.0, 0.08931005631234078, 0.06637202427118294, 0.044829461859905426], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 440.7142857142857, 391, 548, 400.0, 548.0, 548.0, 548.0, 0.032016538829200906, 9.413925464925882, 0.018259432301028646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 114.00000000000001, 77, 243, 82.0, 242.0, 243.0, 243.0, 0.08931341487491422, 0.023898316089576654, 0.05093655692084951], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 663.2857142857143, 549, 728, 699.0, 728.0, 728.0, 728.0, 0.03197369022061846, 28.769982664264834, 0.018203770897090393], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2a3e93ec-b127-482a-b41b-4baf74223f1f", 3, 0, 0.0, 272.0, 172, 467, 177.0, 467.0, 467.0, 467.0, 0.017337833464330297, 0.023901603099426693, 0.011118337215081603], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 197.0, 79, 244, 241.0, 244.0, 244.0, 244.0, 0.03203822618072306, 0.056692642421357596, 0.017739916254365207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 93.50000000000001, 79, 237, 83.0, 163.0, 237.0, 237.0, 0.07665688378816417, 0.05696864117460248, 0.03847816237023084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 113.7142857142857, 78, 240, 80.5, 235.5, 240.0, 240.0, 0.07665814301124137, 0.02873610913381774, 0.04325923388399433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 134.85714285714286, 78, 534, 80.5, 385.5, 534.0, 534.0, 0.07665730352459331, 4.9460697475373845, 0.04459555743548466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 125.57142857142857, 79, 558, 81.0, 397.0, 558.0, 558.0, 0.07665772326561901, 1.6291798136943547, 0.04467066267863987], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 129.85714285714286, 80, 244, 83.0, 244.0, 244.0, 244.0, 0.03206214559878347, 0.02382743437565842, 0.018003646210254392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 88.89473684210527, 79, 230, 81.0, 82.0, 230.0, 230.0, 0.08931215538434781, 0.024072416880937496, 0.05250577884900135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 426.764705882353, 78, 817, 543.0, 810.6, 817.0, 817.0, 0.11615592224385911, 55.347422843855696, 0.06300231030712992], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 80.89473684210526, 78, 84, 81.0, 83.0, 84.0, 84.0, 0.08931215538434781, 0.024072416880937496, 0.05259299775074388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 334.3529411764706, 79, 649, 386.0, 580.9999999999999, 649.0, 649.0, 0.11595784591248594, 18.065243873844686, 0.06300811491763583], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 414.64285714285717, 84, 941, 392.5, 848.0, 941.0, 941.0, 0.08820231090054559, 0.01737467396645792, 0.059913093160540803], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 243.78571428571428, 162, 642, 166.0, 560.0, 642.0, 642.0, 0.07662206168075965, 6.657883135963112, 0.17092449306296692], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 430.76190476190476, 141, 795, 456.0, 661.2, 781.9999999999998, 795.0, 0.08896307185250771, 0.0546462619094017, 0.040224513933311584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 101.88235294117648, 80, 252, 83.0, 245.6, 252.0, 252.0, 0.11615274769573447, 0.08632054784809953, 0.058303234683210456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 165.23529411764704, 79, 248, 233.0, 244.8, 248.0, 248.0, 0.11602194862275123, 0.1232999798667795, 0.061010163010837816], "isController": false}, {"data": ["login", 21, 0, 0.0, 1891.8571428571427, 1098, 2902, 1864.0, 2466.8, 2862.9999999999995, 2902.0, 0.08834554044332633, 35.349460678083574, 0.18212640222252138], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 87.52631578947368, 82, 99, 85.0, 97.0, 99.0, 99.0, 0.090251421459888, 0.07306487147485073, 0.03208155997206956], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eb3bf0f2-c860-4c7b-ab87-93714501af30", 1, 0, 0.0, 587.0, 587, 587, 587.0, 587.0, 587.0, 587.0, 1.7035775127768313, 0.307775234241908, 1.174536839863714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a48d09d6-fe22-45fe-8b89-1205346bd7fc", 3, 0, 0.0, 339.33333333333337, 168, 658, 192.0, 658.0, 658.0, 658.0, 0.02619515389652914, 0.031115272320454048, 0.01679832460161537], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/33671b42-df32-496b-8a94-7d195cc09dd3", 3, 0, 0.0, 489.6666666666667, 260, 817, 392.0, 817.0, 817.0, 817.0, 0.02450499901980004, 0.024576791009115858, 0.015714468772462915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 554.5294117647059, 162, 903, 636.0, 895.0, 903.0, 903.0, 0.11589065375962915, 73.4850865345286, 0.24494283224827867], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a3f22d1f-4a38-4d8e-ba8d-557ee7264e8b", 3, 0, 0.0, 309.3333333333333, 164, 535, 229.0, 535.0, 535.0, 535.0, 0.028813461649282546, 0.02402059742311608, 0.018477382633166214], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=528f3666-c21d-469a-9b5e-153537f98b3e", 1, 0, 0.0, 332.0, 332, 332, 332.0, 332.0, 332.0, 332.0, 3.0120481927710845, 0.5441688629518072, 2.0766660391566263], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 534.8181818181818, 81, 967, 655.0, 962.4, 967.0, 967.0, 0.05022578774582099, 38.24238922360064, 0.08417189233645798], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 320.94444444444446, 161, 804, 320.0, 639.3000000000003, 804.0, 804.0, 0.11432491139819366, 15.354421118986828, 0.2538692829605071], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 787.1739130434781, 199, 1417, 819.0, 1137.2, 1362.7999999999993, 1417.0, 0.09655994693401178, 0.03012578507435116, 0.04356513230811859], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 206.21052631578948, 161, 329, 166.0, 325.0, 329.0, 329.0, 0.08927606508695018, 0.1383604641533105, 0.20078396278832644], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 89.23076923076923, 82, 105, 86.0, 101.8, 105.0, 105.0, 0.07063528286714046, 0.05483891589782878, 0.025108635706678838], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bd10d855-585e-4177-863b-5e2fdfc175c3", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 4.761904761904763, 1.5206473214285714, 2.8413318452380953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 274.83333333333326, 159, 789, 169.0, 598.2000000000003, 789.0, 789.0, 0.08836350783489769, 6.002308918516573, 0.19747556503554176], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/17629bf8-ab28-4f8b-a8bb-4d7be15d405c", 1, 0, 0.0, 166.0, 166, 166, 166.0, 166.0, 166.0, 166.0, 6.024096385542169, 1.9237104668674698, 3.5944559487951806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 106.99999999999999, 79, 238, 81.0, 237.4, 238.0, 238.0, 0.0641094133988674, 0.04764381210599423, 0.032179920397478363], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 105.91666666666667, 79, 235, 81.0, 233.8, 235.0, 235.0, 0.06405636960525263, 0.017140083273280485, 0.036532148290495635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 119.16666666666666, 78, 242, 81.0, 239.9, 242.0, 242.0, 0.0641097559021044, 0.017279582645489077, 0.037689524465885596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 105.49999999999999, 77, 237, 79.5, 236.7, 237.0, 237.0, 0.06405568574280575, 0.017265009047865612, 0.03772029150674987], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 84.5, 84, 85, 84.5, 85.0, 85.0, 85.0, 0.03629434715543054, 0.010703996914980493, 0.022435861083386265], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 735.6363636363633, 614, 1178, 645.0, 1024.6, 1063.3999999999996, 1178.0, 0.2488946813469275, 297.7645686824873, 0.4914697711752807], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8f555e9-d262-4927-b7f1-ad3ac089b3d4", 1, 0, 0.0, 178.0, 178, 178, 178.0, 178.0, 178.0, 178.0, 5.617977528089887, 1.014966643258427, 3.8733321629213484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 787.1739130434781, 199, 1417, 819.0, 1137.2, 1362.7999999999993, 1417.0, 0.09181013663743379, 0.028643889436645018, 0.0414221514907172], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 3, 0, 0.0, 133.0, 80, 239, 80.0, 239.0, 239.0, 239.0, 0.04519910204450605, 0.012182570472933271, 0.026616268098473776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 3, 0, 0.0, 185.0, 88, 235, 232.0, 235.0, 235.0, 235.0, 0.045093795093795096, 0.012154186958874458, 0.02651021938131313], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/528f3666-c21d-469a-9b5e-153537f98b3e", 3, 0, 0.0, 266.0, 169, 371, 258.0, 371.0, 371.0, 371.0, 0.04066142586066685, 0.026406101755218216, 0.02607519822445107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 155.07692307692307, 79, 717, 82.0, 526.9999999999998, 717.0, 717.0, 0.07137719553508189, 4.9581682020770765, 0.04149013965222834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 142.76923076923075, 80, 390, 83.0, 331.59999999999997, 390.0, 390.0, 0.07137719553508189, 1.6321635423129506, 0.04155984394474307], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 81.76923076923077, 79, 90, 81.0, 87.6, 90.0, 90.0, 0.07137797934431091, 0.05304554910255918, 0.03582839978806231], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 3, 0, 0.0, 135.66666666666666, 80, 238, 89.0, 238.0, 238.0, 238.0, 0.04509176173513099, 0.012065569058033096, 0.02571639536456689], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 103.76923076923076, 76, 235, 81.0, 234.6, 235.0, 235.0, 0.07137719553508189, 0.027345530140393454, 0.040246186124273185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 3, 0, 0.0, 136.0, 82, 240, 86.0, 240.0, 240.0, 240.0, 0.04519569736961041, 0.03358781806472024, 0.022686121531230227], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 411.35714285714295, 82, 658, 423.0, 647.5, 658.0, 658.0, 0.08918901700961966, 0.017220647257437726, 0.06069531598394598], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 3, 0, 0.0, 139.0, 84, 247, 86.0, 247.0, 247.0, 247.0, 0.047063253012048195, 0.03704392766378012, 0.016729515719126505], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 965.9523809523808, 654, 1315, 1027.0, 1190.4, 1303.7999999999997, 1315.0, 0.08762559668858697, 0.045353092036085056, 0.04030435160187936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 0, 0.0, 325.3333333333333, 175, 480, 321.0, 480.0, 480.0, 480.0, 0.04503354999474608, 0.06979320687662308, 0.10128150941201194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/94de8e59-4843-4917-970f-cbff5579221f", 3, 0, 0.0, 311.0, 166, 414, 353.0, 414.0, 414.0, 414.0, 0.028997274256219913, 0.024173834430396876, 0.018595257254151443], "isController": false}, {"data": ["addBook", 59, 13, 22.033898305084747, 771.8474576271188, 413, 2280, 678.0, 1292.0, 1336.0, 2280.0, 0.27210758857332606, 78.32067191117532, 0.9898264838511065], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 137.3818181818182, 80, 349, 83.0, 323.0, 330.0, 349.0, 0.2496924243318458, 0.18556243644192835, 0.12070092777760123], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=774be447-d9d3-44fe-b12b-cea4a04b3b1c", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 0.4632411858974359, 1.7678285256410255], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 438.3454545454546, 381, 652, 400.0, 563.0, 578.5999999999998, 652.0, 0.24965275571250894, 73.40619943113215, 0.12555778241400598], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2a3e93ec-b127-482a-b41b-4baf74223f1f", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 0.4856560819892473, 1.8533686155913978], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 124.16363636363644, 78, 337, 84.0, 243.2, 261.1999999999997, 337.0, 0.250005681947317, 0.44239286688333823, 0.12158479454078501], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 594.0181818181819, 533, 818, 556.0, 715.6, 743.7999999999996, 818.0, 0.24930082450581778, 224.32132011444043, 0.1251373279257718], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 94.16666666666666, 83, 246, 84.5, 107.40000000000022, 246.0, 246.0, 0.09250693802035152, 0.06910918709528215, 0.03288332562442183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 13, 7.514450867052023, 140.99421965317916, 80, 1326, 87.0, 253.59999999999994, 312.7999999999999, 675.539999999992, 0.7247439307932385, 1.5609822073794013, 0.3482168104983138], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 113.16666666666666, 81, 245, 87.0, 244.4, 245.0, 245.0, 0.06400785162979993, 0.0495685804125306, 0.02275279100903044], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59cb3564-aec1-4ca2-839e-68338ad1772f", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 0.45507320528967254, 1.7366577455919394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 88.22222222222223, 81, 108, 84.5, 104.4, 108.0, 108.0, 0.11355678785699416, 0.09215399483316615, 0.04036588943354089], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59cb3564-aec1-4ca2-839e-68338ad1772f", 3, 0, 0.0, 297.3333333333333, 174, 526, 192.0, 526.0, 526.0, 526.0, 0.043733690977739555, 0.028116549375337117, 0.028045368237678035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 240.58333333333331, 159, 473, 165.5, 472.4, 473.0, 473.0, 0.06402800157935738, 0.09923089697894545, 0.14400047620826173], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6f696d4f-92fe-4fa6-b143-a879c6608589", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 263.2307692307692, 162, 799, 165.0, 613.3999999999999, 799.0, 799.0, 0.0713458572753566, 6.667793450999116, 0.1590543123768598], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8f555e9-d262-4927-b7f1-ad3ac089b3d4", 3, 0, 0.0, 294.3333333333333, 180, 480, 223.0, 480.0, 480.0, 480.0, 0.06836516111389636, 0.03026582653479787, 0.04384093990702338], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a48d09d6-fe22-45fe-8b89-1205346bd7fc", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb3bf0f2-c860-4c7b-ab87-93714501af30", 3, 0, 0.0, 549.0, 185, 825, 637.0, 825.0, 825.0, 825.0, 0.02317192798164783, 0.027388434407995856, 0.014859602253856194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/88df511d-3838-4797-8cce-e56fdcc3c361", 3, 0, 0.0, 244.66666666666669, 164, 375, 195.0, 375.0, 375.0, 375.0, 0.06969126768415917, 0.0448047700768927, 0.044691340279229684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 106.92857142857142, 81, 244, 85.0, 242.5, 244.0, 244.0, 0.08107388146998529, 0.0672184818047046, 0.028819231303783836], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 85.41176470588233, 82, 89, 85.0, 89.0, 89.0, 89.0, 0.12033864711045672, 0.09342697700470029, 0.04277662846504516], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=33671b42-df32-496b-8a94-7d195cc09dd3", 1, 0, 0.0, 755.0, 755, 755, 755.0, 755.0, 755.0, 755.0, 1.3245033112582782, 0.23929014900662252, 0.9131829470198676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 90.83333333333333, 79, 245, 81.0, 106.40000000000022, 245.0, 245.0, 0.08839822417789651, 0.0656943833978313, 0.04437176487054571], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 120.88888888888891, 77, 331, 80.5, 252.70000000000013, 331.0, 331.0, 0.08840082900332977, 0.031030455927275585, 0.0500036373257767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 159.55555555555554, 77, 698, 81.5, 287.60000000000065, 698.0, 698.0, 0.08840082900332977, 4.441570927238751, 0.05154796604425935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 151.44444444444443, 78, 563, 82.0, 275.90000000000043, 563.0, 563.0, 0.08840126315582686, 1.4665535509068497, 0.051634548564216155], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 27.586206896551722, 0.6144393241167435], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 6.896551724137931, 0.15360983102918588], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.896551724137931, 0.15360983102918588], "isController": false}, {"data": ["401/Unauthorized", 17, 58.62068965517241, 1.30568356374808], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1302, 29, "401/Unauthorized", 17, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
