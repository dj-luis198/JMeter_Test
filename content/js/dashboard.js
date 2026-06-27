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

    var data = {"OkPercent": 99.09159727479182, "KoPercent": 0.9084027252081757};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7285435630689207, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/df6cabea-77b1-4d6e-9922-3c8b213b8d16"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5357142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/525e9753-3158-4fd6-89af-0c1a4ecf0ba3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bcd28ad0-7807-431e-824e-970aa90ccd40"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5294117647058824, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=180f92f3-f7b8-44c1-96c2-58b0e378c389"], "isController": false}, {"data": [0.7045454545454546, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bbf31535-9d1f-4958-8682-68883aceacf0"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e41f5a93-a5be-4f9b-9305-f018aaeb07f4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bcd28ad0-7807-431e-824e-970aa90ccd40"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7eb179a1-96b6-46f0-8de7-865d3d5ee2f4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=55688ccc-8503-45e3-aedb-3b11a8a59327"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/2fb22e2f-7f01-4c02-8c4d-9f300e33facf"], "isController": false}, {"data": [0.4117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e4e8ab7e-26f6-42cf-98cb-094a0d011ed0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/936b7d20-2617-4c4c-a3c6-b101e32d7836"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/afa85292-6022-4739-82db-c341a036444e"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d331e75d-772b-4c56-ad07-59555b0504f6"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=936b7d20-2617-4c4c-a3c6-b101e32d7836"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.18421052631578946, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b795a33d-16db-4370-b6e8-08067d32f59d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=525e9753-3158-4fd6-89af-0c1a4ecf0ba3"], "isController": false}, {"data": [0.13636363636363635, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2f67035d-841d-4198-8fc2-f4d5f9dc45d0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e41f5a93-a5be-4f9b-9305-f018aaeb07f4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7eb179a1-96b6-46f0-8de7-865d3d5ee2f4"], "isController": false}, {"data": [0.2711864406779661, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/180f92f3-f7b8-44c1-96c2-58b0e378c389"], "isController": false}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.32456140350877194, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9371428571428572, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5fa2b140-f9c2-44b0-beca-bd4d9f2ce361"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e4e8ab7e-26f6-42cf-98cb-094a0d011ed0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2f67035d-841d-4198-8fc2-f4d5f9dc45d0"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bbf31535-9d1f-4958-8682-68883aceacf0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b795a33d-16db-4370-b6e8-08067d32f59d"], "isController": false}, {"data": [0.8043478260869565, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/55688ccc-8503-45e3-aedb-3b11a8a59327"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d331e75d-772b-4c56-ad07-59555b0504f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/19c12e1e-0fdd-492d-b940-9738f22fe32b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2fb22e2f-7f01-4c02-8c4d-9f300e33facf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=df6cabea-77b1-4d6e-9922-3c8b213b8d16"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1321, 12, 0.9084027252081757, 498.84405753217214, 139, 3886, 161.0, 1410.8, 1692.0, 2387.5999999999995, 5.237304195790333, 752.7909130938551, 3.823274961691558], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2366.175438596491, 1702, 3042, 2336.0, 2978.0, 3016.9, 3042.0, 0.2576643853574302, 310.05648804290337, 1.2669337697994738], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/df6cabea-77b1-4d6e-9922-3c8b213b8d16", 3, 0, 0.0, 453.6666666666667, 333, 647, 381.0, 647.0, 647.0, 647.0, 0.01818292017698042, 0.025066623355960965, 0.011660271077034972], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 708.4285714285714, 498, 1197, 599.0, 1102.0, 1197.0, 1197.0, 0.08331399258505466, 0.015051844363510853, 0.05662747933515434], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 708.4285714285714, 498, 1197, 599.0, 1102.0, 1197.0, 1197.0, 0.0831008488158129, 0.015013336944263074, 0.05648260817949784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 176.76470588235293, 141, 420, 143.0, 420.0, 420.0, 420.0, 0.08804822971265201, 0.04689701205742816, 0.048910063265242706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 145.1764705882353, 140, 159, 144.0, 157.4, 159.0, 159.0, 0.08804686164730498, 0.06543326339218662, 0.044195397350307385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 332.6470588235294, 142, 1122, 144.0, 1121.2, 1122.0, 1122.0, 0.08804686164730498, 4.588137740898803, 0.05051263828536506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 399.7058823529413, 141, 1707, 142.0, 1689.4, 1707.0, 1707.0, 0.08804822971265201, 14.000594123233856, 0.05042743854751497], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/525e9753-3158-4fd6-89af-0c1a4ecf0ba3", 3, 0, 0.0, 498.3333333333333, 245, 755, 495.0, 755.0, 755.0, 755.0, 0.044639535748828216, 0.028698920281229078, 0.02862626478684622], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 331.64285714285717, 227, 619, 286.5, 541.5, 619.0, 619.0, 0.08310676845267069, 0.1640338392952546, 0.05372722726139453], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bcd28ad0-7807-431e-824e-970aa90ccd40", 3, 0, 0.0, 700.0, 376, 1284, 440.0, 1284.0, 1284.0, 1284.0, 0.023328512107497784, 0.027573511543725403, 0.014960015902269084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 163.92857142857142, 142, 421, 144.0, 286.5, 421.0, 421.0, 0.12734566160619265, 0.0946387192210084, 0.06392155279842092], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 163.07142857142856, 141, 436, 142.0, 290.0, 436.0, 436.0, 0.12735145362587783, 0.04773902844485682, 0.07186615930757195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 1007.6, 702, 1125, 1110.0, 1125.0, 1125.0, 1125.0, 0.054090894338847, 15.904518922347112, 0.03084871317762368], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1624.6, 1531, 1718, 1664.0, 1718.0, 1718.0, 1718.0, 0.05373743887366328, 48.35304195886399, 0.030594655139986028], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 200.2, 141, 434, 141.0, 434.0, 434.0, 434.0, 0.054663926181834084, 0.09672952562644858, 0.030268013813574145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 171.3, 142, 422, 143.5, 394.30000000000007, 422.0, 422.0, 0.05358913212400525, 0.039825517135125, 0.026899232335682324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 199.29999999999998, 141, 431, 143.0, 429.9, 431.0, 431.0, 0.05358913212400525, 0.022388115940087352, 0.030112486937649046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 325.09999999999997, 141, 1689, 143.0, 1562.2000000000005, 1689.0, 1689.0, 0.05358884494603603, 4.834933169686399, 0.031043850412098218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 297.4, 141, 844, 144.0, 802.5000000000002, 844.0, 844.0, 0.05358913212400525, 1.5886979683020284, 0.031096349910238207], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 142.0, 141, 144, 141.0, 144.0, 144.0, 144.0, 0.05466153577050901, 0.04062248898570055, 0.030693733464885433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 1038.0588235294117, 141, 2392, 1400.0, 2061.6, 2392.0, 2392.0, 0.08808746567179647, 46.634044752966474, 0.047332844318358464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 344.0, 142, 1555, 147.0, 989.5, 1555.0, 1555.0, 0.12735145362587783, 8.216949241917732, 0.07408699241349198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 704.8235294117646, 142, 1267, 855.0, 1159.0, 1267.0, 1267.0, 0.08796030403220383, 15.22343857525004, 0.047350414124872585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 232.35714285714283, 140, 842, 143.0, 633.5, 842.0, 842.0, 0.12735029517979132, 2.7065313361320076, 0.07421068400753185], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 588.9285714285713, 255, 1016, 531.5, 1010.0, 1016.0, 1016.0, 0.08315464982982994, 0.015023056854022013, 0.05733123318345698], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 583.1, 287, 1833, 427.5, 1734.2000000000003, 1833.0, 1833.0, 0.053547810162303415, 6.4808695009745705, 0.1190602091577465], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=180f92f3-f7b8-44c1-96c2-58b0e378c389", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 520.0, 1.9230769230769231, 0.3474308894230769, 1.3258713942307692], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 674.9545454545455, 203, 1581, 590.5, 1223.3, 1529.9999999999993, 1581.0, 0.09280585858074532, 0.05700672367899297, 0.041962023948129965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 144.23529411764707, 142, 153, 143.0, 149.0, 153.0, 153.0, 0.08808472714460402, 0.06546140366898795, 0.04421440405500632], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 260.88235294117646, 140, 432, 147.0, 431.2, 432.0, 432.0, 0.08795802849840123, 0.10124672421018864, 0.04581821015760009], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bbf31535-9d1f-4958-8682-68883aceacf0", 1, 0, 0.0, 1004.0, 1004, 1004, 1004.0, 1004.0, 1004.0, 1004.0, 0.9960159362549801, 0.17994428535856574, 0.6867062998007968], "isController": false}, {"data": ["login", 22, 0, 0.0, 3541.5454545454536, 2350, 4971, 3506.5, 4624.4, 4919.999999999999, 4971.0, 0.0950820947449855, 25.983634568446142, 0.17929187609938674], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 171.71428571428572, 144, 428, 147.5, 306.0, 428.0, 428.0, 0.12875457538580387, 0.10423588183089007, 0.04576822796917248], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e41f5a93-a5be-4f9b-9305-f018aaeb07f4", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 0.7084865196078431, 2.703737745098039], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bcd28ad0-7807-431e-824e-970aa90ccd40", 1, 0, 0.0, 856.0, 856, 856, 856.0, 856.0, 856.0, 856.0, 1.1682242990654206, 0.21105614778037385, 0.8054358936915889], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7eb179a1-96b6-46f0-8de7-865d3d5ee2f4", 1, 0, 0.0, 577.0, 577, 577, 577.0, 577.0, 577.0, 577.0, 1.7331022530329288, 0.3131092937608319, 1.1948927642980938], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=55688ccc-8503-45e3-aedb-3b11a8a59327", 1, 0, 0.0, 543.0, 543, 543, 543.0, 543.0, 543.0, 543.0, 1.8416206261510129, 0.3327146639042357, 1.2697110957642725], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2fb22e2f-7f01-4c02-8c4d-9f300e33facf", 3, 0, 0.0, 987.0, 307, 1909, 745.0, 1909.0, 1909.0, 1909.0, 0.03763737642394741, 0.024197206522557333, 0.024135947771867314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1200.5294117647059, 285, 2537, 1544.0, 2208.9999999999995, 2537.0, 2537.0, 0.08789072597739658, 61.90777261796745, 0.18444026371095326], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e4e8ab7e-26f6-42cf-98cb-094a0d011ed0", 3, 0, 0.0, 419.6666666666667, 227, 517, 515.0, 517.0, 517.0, 517.0, 0.021285653469561516, 0.025533083670356182, 0.013649979601248759], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/936b7d20-2617-4c4c-a3c6-b101e32d7836", 3, 0, 0.0, 1121.3333333333333, 457, 2367, 540.0, 2367.0, 2367.0, 2367.0, 0.031051721817974807, 0.02588654283067496, 0.019912725254365354], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/afa85292-6022-4739-82db-c341a036444e", 1, 0, 0.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 243.0, 4.11522633744856, 1.3141396604938271, 2.455471965020576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 579.5294117647059, 285, 1851, 289.0, 1834.2, 1851.0, 1851.0, 0.0879803338077371, 18.686713594902315, 0.19389737514555572], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 0, 0.0, 1767.2, 1673, 1859, 1809.0, 1859.0, 1859.0, 1859.0, 0.05365382551775942, 64.18862840701792, 0.12098308898486962], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d331e75d-772b-4c56-ad07-59555b0504f6", 3, 0, 0.0, 1156.0, 230, 2432, 806.0, 2432.0, 2432.0, 2432.0, 0.045129069137733915, 0.0290136430817137, 0.02894019082074734], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1192.1304347826087, 221, 2300, 1329.0, 1794.8000000000002, 2203.5999999999985, 2300.0, 0.0924563646157433, 0.029128151556080815, 0.041713711379368565], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 23, 0, 0.0, 163.82608695652175, 143, 425, 147.0, 190.40000000000006, 381.19999999999936, 425.0, 0.10445192259658397, 0.08109304537527759, 0.037129394360504456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 529.0714285714286, 286, 1700, 430.5, 1273.0, 1700.0, 1700.0, 0.12717907722495253, 11.050909032326196, 0.28370444263769407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 655.4615384615385, 282, 1685, 565.0, 1573.8, 1685.0, 1685.0, 0.13539410098316948, 25.09730840758311, 0.29917499101712214], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=936b7d20-2617-4c4c-a3c6-b101e32d7836", 1, 0, 0.0, 612.0, 612, 612, 612.0, 612.0, 612.0, 612.0, 1.6339869281045751, 0.29520271650326796, 1.1265573937908497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 15, 0, 0.0, 143.66666666666666, 141, 148, 143.0, 148.0, 148.0, 148.0, 0.07302432683741376, 0.054269055393820195, 0.03665478905706121], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 15, 0, 0.0, 161.39999999999998, 140, 420, 143.0, 256.2000000000001, 420.0, 420.0, 0.07292633953531337, 0.01951349319597252, 0.0415908030162334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 15, 0, 0.0, 198.66666666666669, 139, 426, 143.0, 424.2, 426.0, 426.0, 0.07302503785131129, 0.019682529733361247, 0.04293073514305605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 15, 0, 0.0, 180.2, 139, 428, 143.0, 424.4, 428.0, 428.0, 0.07302574887905476, 0.019682721377557725, 0.04300246735749025], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1644.2456140350876, 1121, 2452, 1554.0, 2377.0, 2409.7, 2452.0, 0.25694425661969544, 307.39465919387123, 0.5073645379736564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1192.1304347826087, 221, 2300, 1329.0, 1794.8000000000002, 2203.5999999999985, 2300.0, 0.09346629930347287, 0.029446329009501053, 0.042169365506059056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 143.42857142857144, 139, 148, 144.0, 148.0, 148.0, 148.0, 0.0396402926586178, 0.01068429763064308, 0.02334286764955716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 143.42857142857142, 142, 149, 142.0, 149.0, 149.0, 149.0, 0.03964074162164612, 0.010684418640209302, 0.023304420367413044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 23, 0, 0.0, 204.04347826086953, 139, 430, 143.0, 425.8, 429.4, 430.0, 0.10593659464513544, 0.02855322277544666, 0.06227913083630033], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 23, 0, 0.0, 216.78260869565213, 141, 430, 143.0, 426.0, 429.2, 430.0, 0.10593610670990088, 0.028553091261652973, 0.06238229721295921], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 23, 0, 0.0, 193.21739130434784, 141, 430, 144.0, 427.0, 429.8, 430.0, 0.10593513085291598, 0.07872718220612213, 0.05317446997890509], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 143.42857142857142, 140, 148, 142.0, 148.0, 148.0, 148.0, 0.03964074162164612, 0.010606995316729526, 0.022607610456095044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 23, 0, 0.0, 217.0, 141, 432, 144.0, 426.2, 431.0, 432.0, 0.10593708258486483, 0.02834644592602828, 0.06041724241168071], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 145.0, 141, 154, 143.0, 154.0, 154.0, 154.0, 0.039640517138860736, 0.02945940775651662, 0.019897681454467204], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 152.42857142857144, 144, 164, 153.0, 164.0, 164.0, 164.0, 0.04008130779581437, 0.031548373128346074, 0.014247652380543388], "isController": false}, {"data": ["deleteAccount", 14, 0, 0.0, 567.8571428571429, 440, 806, 505.0, 797.5, 806.0, 806.0, 0.0836895119108109, 0.015119687210449234, 0.05696444316585468], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b795a33d-16db-4370-b6e8-08067d32f59d", 3, 0, 0.0, 449.6666666666667, 258, 604, 487.0, 604.0, 604.0, 604.0, 0.06734006734006734, 0.03046962682379349, 0.04318357182940517], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=525e9753-3158-4fd6-89af-0c1a4ecf0ba3", 1, 0, 0.0, 1016.0, 1016, 1016, 1016.0, 1016.0, 1016.0, 1016.0, 0.984251968503937, 0.17781895915354332, 0.678595595472441], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1869.090909090909, 1143, 3886, 1719.0, 2652.5, 3704.3499999999976, 3886.0, 0.09541032946921499, 0.04938229943230854, 0.043885024589844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 290.57142857142856, 285, 299, 289.0, 299.0, 299.0, 299.0, 0.03960799402485119, 0.06138465480218636, 0.08907930687425028], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2f67035d-841d-4198-8fc2-f4d5f9dc45d0", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 0.3514865029182879, 1.3413484922178989], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e41f5a93-a5be-4f9b-9305-f018aaeb07f4", 3, 0, 0.0, 513.6666666666666, 459, 619, 463.0, 619.0, 619.0, 619.0, 0.11823126034523528, 0.0548820889493182, 0.07581887463545361], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7eb179a1-96b6-46f0-8de7-865d3d5ee2f4", 3, 0, 0.0, 378.3333333333333, 242, 476, 417.0, 476.0, 476.0, 476.0, 0.04978509434275378, 0.03155324826996797, 0.0319259882341227], "isController": false}, {"data": ["addBook", 59, 6, 10.169491525423728, 1513.830508474576, 717, 3922, 1141.0, 2489.0, 2706.0, 3922.0, 0.26669197980373277, 92.96336989895086, 0.9677692925091195], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/180f92f3-f7b8-44c1-96c2-58b0e378c389", 3, 0, 0.0, 376.3333333333333, 244, 619, 266.0, 619.0, 619.0, 619.0, 0.020931011386470192, 0.024739746856859788, 0.013422556129995534], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 249.42105263157896, 141, 588, 145.0, 572.0, 577.3, 588.0, 0.25826095230327994, 0.19193025849882425, 0.12484294081066755], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 925.3157894736842, 696, 1295, 848.0, 1268.0, 1274.6, 1295.0, 0.2576678796645797, 75.76291200020341, 0.12958882619849468], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 200.91228070175433, 142, 444, 146.0, 425.6, 433.29999999999995, 444.0, 0.25880034688327197, 0.4579553013207898, 0.12586188744909124], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1390.719298245614, 977, 1872, 1400.0, 1821.4, 1834.5, 1872.0, 0.25765623234263757, 231.83953077325123, 0.129331351000113], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 147.38461538461536, 143, 157, 147.0, 155.0, 157.0, 157.0, 0.14069873154682022, 0.10511184534503658, 0.05001400222953375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 6, 3.4285714285714284, 235.42857142857144, 142, 1754, 150.0, 427.0, 505.4, 1542.7200000000025, 0.741874356159041, 1.6185529131286325, 0.3562818476062894], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 15, 0, 0.0, 190.06666666666663, 142, 478, 147.0, 450.40000000000003, 478.0, 478.0, 0.07159460272154951, 0.0554438671466687, 0.025449643936175798], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5fa2b140-f9c2-44b0-beca-bd4d9f2ce361", 1, 0, 0.0, 385.0, 385, 385, 385.0, 385.0, 385.0, 385.0, 2.5974025974025974, 0.8294439935064934, 1.54981737012987], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 150.35294117647058, 142, 164, 149.0, 163.2, 164.0, 164.0, 0.09139883224550802, 0.07417229452736052, 0.03248942864977043], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e4e8ab7e-26f6-42cf-98cb-094a0d011ed0", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2f67035d-841d-4198-8fc2-f4d5f9dc45d0", 3, 0, 0.0, 479.33333333333337, 259, 789, 390.0, 789.0, 789.0, 789.0, 0.03978779840848806, 0.03316945043103448, 0.025514961870026522], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 15, 0, 0.0, 362.66666666666674, 284, 577, 289.0, 571.0, 577.0, 577.0, 0.07287532004411386, 0.11294251260743038, 0.1638983027945256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bbf31535-9d1f-4958-8682-68883aceacf0", 3, 0, 0.0, 398.3333333333333, 240, 491, 464.0, 491.0, 491.0, 491.0, 0.04019292604501608, 0.025840178691050375, 0.02577476051714898], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b795a33d-16db-4370-b6e8-08067d32f59d", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 0.679188204887218, 2.5919290413533833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 23, 0, 0.0, 448.7391304347826, 284, 861, 292.0, 854.0, 860.4, 861.0, 0.10586491636671608, 0.16406994362693203, 0.23809267811772178], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/55688ccc-8503-45e3-aedb-3b11a8a59327", 3, 0, 0.0, 334.3333333333333, 250, 441, 312.0, 441.0, 441.0, 441.0, 0.028329949478256764, 0.023027305939846074, 0.018167317862033145], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 180.6, 143, 427, 155.0, 401.1000000000001, 427.0, 427.0, 0.052011276044646476, 0.04312263023623522, 0.018488383281495428], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d331e75d-772b-4c56-ad07-59555b0504f6", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.3988169150110375, 1.5219715783664458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 181.35294117647055, 143, 450, 146.0, 433.2, 450.0, 450.0, 0.08742292640532354, 0.06787229149632053, 0.031076118370642353], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19c12e1e-0fdd-492d-b940-9738f22fe32b", 1, 0, 0.0, 276.0, 276, 276, 276.0, 276.0, 276.0, 276.0, 3.6231884057971016, 1.1570142663043477, 2.1618829257246377], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2fb22e2f-7f01-4c02-8c4d-9f300e33facf", 1, 0, 0.0, 686.0, 686, 686, 686.0, 686.0, 686.0, 686.0, 1.4577259475218658, 0.2633586916909621, 1.0050337099125364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 164.76923076923077, 140, 423, 143.0, 312.5999999999999, 423.0, 423.0, 0.1359946439032555, 0.10106633204138422, 0.0682629364905013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 186.6153846153846, 140, 427, 144.0, 424.2, 427.0, 427.0, 0.13600033477005483, 0.06781627270159435, 0.07580547505963092], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 434.46153846153845, 140, 1539, 149.0, 1428.1999999999998, 1539.0, 1539.0, 0.1355988776585203, 18.80201895646233, 0.07792453531307696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 423.69230769230774, 139, 1118, 421.0, 1117.6, 1118.0, 1118.0, 0.13600318038206433, 6.183240746552842, 0.0782896913512439], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=df6cabea-77b1-4d6e-9922-3c8b213b8d16", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.37097343429158114, 1.4157148357289528], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 50.0, 0.45420136260408783], "isController": false}, {"data": ["401/Unauthorized", 6, 50.0, 0.45420136260408783], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1321, 12, "406/Not Acceptable", 6, "401/Unauthorized", 6, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
