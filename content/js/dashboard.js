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

    var data = {"OkPercent": 98.14528593508501, "KoPercent": 1.8547140649149922};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7205009887936717, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5a98087c-9777-49f1-8d68-04f6c420dafc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f018850a-2ef4-4e0f-8e88-8350e2653342"], "isController": false}, {"data": [0.47058823529411764, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.47058823529411764, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/dc02a313-1432-4d90-a4ed-fd8a0659a603"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a70936e5-fc21-4425-bdac-152d6af8090d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6136363636363636, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5882352941176471, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1f97df51-6571-4bb7-b09c-b1fffeb8dafc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=094a353b-ffa2-4763-941f-78b7f2a6c43f"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f56c4227-e37c-4b73-9bb7-c07ee8c165ad"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4fb85e6a-e17e-454e-8cf6-ac0f0acaff0b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0bc40fb1-de55-45da-8c52-e75cab2a55a7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b7f6f6cf-913b-4b76-b7f7-b220c0d7129b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7161db5a-2bfb-47b5-8a6e-ba285d20e18e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=049727d3-e6de-4c28-a6e3-8fe1ecc1c989"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f018850a-2ef4-4e0f-8e88-8350e2653342"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.1111111111111111, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/846fe707-a93b-4ba6-beed-5e9710074374"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b814630c-e55c-49d2-9400-1b652a2ce46b"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dc02a313-1432-4d90-a4ed-fd8a0659a603"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a70936e5-fc21-4425-bdac-152d6af8090d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4fb85e6a-e17e-454e-8cf6-ac0f0acaff0b"], "isController": false}, {"data": [0.29310344827586204, 500, 1500, "addBook"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9385964912280702, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5a98087c-9777-49f1-8d68-04f6c420dafc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b7f6f6cf-913b-4b76-b7f7-b220c0d7129b"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1f97df51-6571-4bb7-b09c-b1fffeb8dafc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7161db5a-2bfb-47b5-8a6e-ba285d20e18e"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0bc40fb1-de55-45da-8c52-e75cab2a55a7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=846fe707-a93b-4ba6-beed-5e9710074374"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f56c4227-e37c-4b73-9bb7-c07ee8c165ad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/33c28be4-3401-45bf-b0b3-714e324f0850"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/049727d3-e6de-4c28-a6e3-8fe1ecc1c989"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/094a353b-ffa2-4763-941f-78b7f2a6c43f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b814630c-e55c-49d2-9400-1b652a2ce46b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1294, 24, 1.8547140649149922, 493.45517774343136, 137, 2847, 161.0, 1398.5, 1657.75, 2258.3499999999995, 5.003557397840814, 697.1264602368957, 3.6536471121759675], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2392.4181818181814, 1708, 3242, 2288.0, 2839.0, 3057.7999999999997, 3242.0, 0.2558222825859447, 307.84164520763466, 1.2578761648635073], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5a98087c-9777-49f1-8d68-04f6c420dafc", 1, 0, 0.0, 971.0, 971, 971, 971.0, 971.0, 971.0, 971.0, 1.0298661174047374, 0.1860597966014418, 0.710044412976313], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f018850a-2ef4-4e0f-8e88-8350e2653342", 3, 0, 0.0, 390.3333333333333, 285, 475, 411.0, 475.0, 475.0, 475.0, 0.06119576525304449, 0.027091875242233235, 0.03924337810823491], "isController": false}, {"data": ["deleteBook", 17, 3, 17.647058823529413, 600.2941176470588, 144, 2072, 549.0, 1090.3999999999992, 2072.0, 2072.0, 0.09800530381644183, 0.019682131327107114, 0.06578538459875476], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 3, 17.647058823529413, 600.2941176470588, 144, 2072, 549.0, 1090.3999999999992, 2072.0, 2072.0, 0.09767757208030246, 0.01961631387825927, 0.06556539693005137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 183.7857142857143, 139, 424, 142.0, 422.0, 424.0, 424.0, 0.09191779922526426, 0.03445635135578754, 0.051870465662136434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 182.7142857142857, 139, 431, 142.0, 426.0, 431.0, 431.0, 0.09208648236214984, 0.06843536433358986, 0.04622309759193848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 270.6428571428572, 140, 1118, 142.0, 768.5, 1118.0, 1118.0, 0.09192081678211483, 1.953561008338531, 0.05356490676602869], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dc02a313-1432-4d90-a4ed-fd8a0659a603", 3, 0, 0.0, 760.0, 281, 1524, 475.0, 1524.0, 1524.0, 1524.0, 0.04131377814501136, 0.026560778592577293, 0.026493536115127732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 282.7857142857142, 137, 1539, 142.0, 980.0, 1539.0, 1539.0, 0.09208829952377193, 5.941705896693373, 0.05357257380219434], "isController": false}, {"data": ["goToProfile", 17, 3, 17.647058823529413, 288.58823529411757, 139, 570, 274.0, 445.9999999999999, 570.0, 570.0, 0.09753858511675942, 0.17513577406908026, 0.06304036196855815], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a70936e5-fc21-4425-bdac-152d6af8090d", 1, 0, 0.0, 741.0, 741, 741, 741.0, 741.0, 741.0, 741.0, 1.3495276653171389, 0.24381115047233468, 0.9304360661268556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 160.74999999999997, 139, 425, 143.5, 231.80000000000018, 425.0, 425.0, 0.09772603727026746, 0.07262647886979837, 0.04905388980167722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 211.125, 139, 424, 142.0, 419.8, 424.0, 424.0, 0.09772782799902271, 0.026149828976301002, 0.05573540190569265], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 1055.6, 831, 1263, 1091.0, 1263.0, 1263.0, 1263.0, 0.03964446840732312, 11.656790031993086, 0.02260973588855147], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1433.6, 1231, 1650, 1516.0, 1650.0, 1650.0, 1650.0, 0.03947295707710648, 35.51783616403777, 0.022473373023391675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 199.8, 139, 436, 141.0, 436.0, 436.0, 436.0, 0.03990614075693968, 0.07061516313630342, 0.02209646661053203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 18, 0, 0.0, 157.05555555555554, 138, 421, 141.0, 175.30000000000038, 421.0, 421.0, 0.08733285461990802, 0.06490263902905273, 0.04383699929163351], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 18, 0, 0.0, 186.33333333333331, 137, 422, 140.0, 420.2, 422.0, 422.0, 0.08733412580966012, 0.030656021809271974, 0.049400260182916475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 18, 0, 0.0, 248.99999999999997, 138, 1530, 141.0, 531.0000000000016, 1530.0, 1530.0, 0.08721690845131842, 4.382086563084474, 0.05085760264945586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 18, 0, 0.0, 239.7777777777778, 138, 1097, 141.0, 486.800000000001, 1097.0, 1097.0, 0.08721733105276164, 1.4469124307712435, 0.050943022250110236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 196.4, 139, 421, 141.0, 421.0, 421.0, 421.0, 0.03990645925949574, 0.029657046383277597, 0.022408412181845753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 22, 0, 0.0, 816.8636363636365, 139, 1774, 416.5, 1677.5, 1760.6499999999999, 1774.0, 0.10315320595475326, 42.20490893506037, 0.05661338061188606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 141.87499999999997, 139, 149, 141.0, 147.6, 149.0, 149.0, 0.09772782799902271, 0.026340703640361594, 0.05745327388223797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 22, 0, 0.0, 615.0454545454547, 139, 1418, 416.5, 1248.1, 1392.6499999999996, 1418.0, 0.10326844632622502, 13.817160428704872, 0.05677747586100067], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 228.81250000000003, 139, 423, 142.5, 421.6, 423.0, 423.0, 0.09772603727026746, 0.026340220983001775, 0.05754765671286258], "isController": false}, {"data": ["deleteBooks", 17, 3, 17.647058823529413, 510.7647058823529, 141, 971, 490.0, 923.8, 971.0, 971.0, 0.09793021608014148, 0.019667051666829884, 0.06628628998577132], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 0, 0.0, 438.0, 279, 1672, 285.5, 924.1000000000012, 1672.0, 1672.0, 0.08715651858128555, 5.920321200520518, 0.1947781745551386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1f97df51-6571-4bb7-b09c-b1fffeb8dafc", 3, 0, 0.0, 381.3333333333333, 305, 473, 366.0, 473.0, 473.0, 473.0, 0.019976161780275538, 0.023611146947975416, 0.01281023395414805], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=094a353b-ffa2-4763-941f-78b7f2a6c43f", 1, 0, 0.0, 588.0, 588, 588, 588.0, 588.0, 588.0, 588.0, 1.7006802721088434, 0.30725180697278914, 1.1725393282312926], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 719.8, 164, 1546, 713.5, 1144.1000000000001, 1525.9999999999998, 1546.0, 0.08186421183183454, 0.050285731681859305, 0.037014775466933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 22, 0, 0.0, 168.36363636363635, 140, 416, 143.0, 337.0999999999998, 415.55, 416.0, 0.10326650738590223, 0.07674395714909336, 0.05183494609018921], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 22, 0, 0.0, 230.27272727272722, 138, 425, 142.0, 423.7, 424.85, 425.0, 0.10315127133941926, 0.09802301211089699, 0.05489068895671866], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f56c4227-e37c-4b73-9bb7-c07ee8c165ad", 1, 0, 0.0, 751.0, 751, 751, 751.0, 751.0, 751.0, 751.0, 1.3315579227696406, 0.2405646637816245, 0.9180467709720372], "isController": false}, {"data": ["login", 20, 0, 0.0, 3376.5, 1682, 4466, 3590.5, 4280.8, 4457.05, 4466.0, 0.07961593274046003, 23.921263978816192, 0.1531284956370469], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4fb85e6a-e17e-454e-8cf6-ac0f0acaff0b", 3, 0, 0.0, 720.3333333333333, 264, 1448, 449.0, 1448.0, 1448.0, 1448.0, 0.04614461723040007, 0.028705196460707856, 0.02959143748173442], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 148.37500000000003, 143, 163, 145.5, 163.0, 163.0, 163.0, 0.10029964519000514, 0.08119961510011159, 0.03565338950113464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0bc40fb1-de55-45da-8c52-e75cab2a55a7", 3, 0, 0.0, 1250.6666666666667, 415, 2847, 490.0, 2847.0, 2847.0, 2847.0, 0.04801997631014502, 0.03087221784262253, 0.030794060329096908], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b7f6f6cf-913b-4b76-b7f7-b220c0d7129b", 1, 0, 0.0, 610.0, 610, 610, 610.0, 610.0, 610.0, 610.0, 1.639344262295082, 0.2961705942622951, 1.130251024590164], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7161db5a-2bfb-47b5-8a6e-ba285d20e18e", 3, 0, 0.0, 651.3333333333333, 243, 1319, 392.0, 1319.0, 1319.0, 1319.0, 0.01758509721627911, 0.020784989580829902, 0.011276901535178987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 22, 0, 0.0, 999.4545454545455, 282, 1937, 838.0, 1821.2, 1920.7999999999997, 1937.0, 0.10308119049404003, 56.14211250257703, 0.21984370021647048], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=049727d3-e6de-4c28-a6e3-8fe1ecc1c989", 1, 0, 0.0, 912.0, 912, 912, 912.0, 912.0, 912.0, 912.0, 1.0964912280701753, 0.1980965597587719, 0.7559793037280701], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f018850a-2ef4-4e0f-8e88-8350e2653342", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 0.7753822424892703, 2.9590262875536477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 507.9285714285714, 282, 1681, 289.5, 1268.5, 1681.0, 1681.0, 0.09182977383638559, 7.9793193917425365, 0.2048490630083434], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 973.3333333333335, 139, 2072, 1382.0, 2072.0, 2072.0, 2072.0, 0.07097288047378342, 47.17968435797144, 0.10953974087012752], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/846fe707-a93b-4ba6-beed-5e9710074374", 3, 0, 0.0, 1123.3333333333333, 359, 2423, 588.0, 2423.0, 2423.0, 2423.0, 0.03277649706650351, 0.02732441698805843, 0.021018782298506487], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b814630c-e55c-49d2-9400-1b652a2ce46b", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["register", 24, 6, 25.0, 1470.4999999999998, 724, 2605, 1451.5, 2406.5, 2573.25, 2605.0, 0.0949393377190033, 0.029946685628162172, 0.04283395900994094], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dc02a313-1432-4d90-a4ed-fd8a0659a603", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.3687021683673469, 1.407047193877551], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 443.75, 283, 843, 428.0, 651.2000000000002, 843.0, 843.0, 0.09763956355115093, 0.15132225327702786, 0.21959366685380918], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 145.5625, 142, 150, 145.5, 150.0, 150.0, 150.0, 0.1013601261933571, 0.07869267609738173, 0.03603035735779491], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 12, 0, 0.0, 752.5833333333333, 284, 1657, 562.5, 1616.8000000000002, 1657.0, 1657.0, 0.13823769972467656, 41.50576809401891, 0.30205747376363656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 240.77777777777777, 141, 481, 142.0, 481.0, 481.0, 481.0, 0.05694832888292689, 0.04232195144522203, 0.02858539164631291], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 203.11111111111111, 138, 430, 140.0, 430.0, 430.0, 430.0, 0.05695013066891092, 0.015238609182892182, 0.032479371397113266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 263.55555555555554, 140, 418, 143.0, 418.0, 418.0, 418.0, 0.056949770302593114, 0.015349742776870802, 0.0334802360567979], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a70936e5-fc21-4425-bdac-152d6af8090d", 3, 0, 0.0, 339.3333333333333, 241, 490, 287.0, 490.0, 490.0, 490.0, 0.02515997551095717, 0.029738239283947098, 0.016134489504096884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 264.5555555555555, 139, 427, 142.0, 427.0, 427.0, 427.0, 0.05694940994083589, 0.015349645648115924, 0.033535638861644575], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 152.33333333333334, 141, 159, 157.0, 159.0, 159.0, 159.0, 0.16270745200130166, 0.047985986820696394, 0.1005798995281484], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1641.6545454545455, 1112, 2663, 1540.0, 2250.6, 2458.2, 2663.0, 0.25089295082041996, 300.1551936836559, 0.49541557281141513], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 1470.4999999999998, 724, 2605, 1451.5, 2406.5, 2573.25, 2605.0, 0.09331259720062209, 0.0294335633748056, 0.04210001944012442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 141.33333333333334, 138, 144, 141.5, 144.0, 144.0, 144.0, 0.07251894557453135, 0.019546122049385405, 0.042704027520939845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 142.33333333333334, 140, 146, 142.0, 146.0, 146.0, 146.0, 0.07251806908554716, 0.01954588580821388, 0.04263269295849549], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 178.12499999999997, 139, 420, 142.5, 419.3, 420.0, 420.0, 0.105368526421158, 0.02840011063695274, 0.06194516885306359], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 245.74999999999997, 140, 424, 145.5, 420.5, 424.0, 424.0, 0.10537130212586603, 0.028400858776112328, 0.062049702326071494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 141.83333333333334, 139, 145, 142.0, 145.0, 145.0, 145.0, 0.07251894557453135, 0.01940448348381015, 0.04135846114797491], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 195.62500000000003, 139, 426, 143.5, 424.6, 426.0, 426.0, 0.10536991425523227, 0.07830713354319507, 0.052890757741395886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 144.66666666666666, 140, 153, 144.0, 153.0, 153.0, 153.0, 0.07251982208470316, 0.05389412559224521, 0.03640155131986076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 177.25, 138, 417, 141.0, 416.3, 417.0, 417.0, 0.10537060818597913, 0.028194869768513944, 0.06009417498106622], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 190.66666666666666, 143, 425, 144.0, 425.0, 425.0, 425.0, 0.0759839927055367, 0.05980771300845955, 0.02700993490704625], "isController": false}, {"data": ["deleteAccount", 15, 1, 6.666666666666667, 842.0666666666667, 139, 1930, 533.0, 1798.6000000000001, 1930.0, 1930.0, 0.09174087484098248, 0.017105850621391527, 0.062438743853361386], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1644.8499999999997, 1085, 2777, 1519.5, 2713.400000000001, 2776.35, 2777.0, 0.08258763580504362, 0.04274555368815734, 0.03798708639079643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 288.5, 281, 297, 288.0, 297.0, 297.0, 297.0, 0.07239469588194837, 0.11219763902798055, 0.16281736778918662], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4fb85e6a-e17e-454e-8cf6-ac0f0acaff0b", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["addBook", 58, 8, 13.793103448275861, 1383.2413793103447, 713, 3831, 1158.5, 2368.0, 2411.7999999999997, 3831.0, 0.26714568651835474, 83.68761442932154, 0.9712503526438211], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 246.309090909091, 139, 583, 143.0, 566.8, 574.0, 583.0, 0.25217674380218336, 0.1874086933920523, 0.12190184392781327], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 903.181818181818, 685, 1269, 838.0, 1236.6, 1257.8, 1269.0, 0.2520935221131854, 74.12386579400292, 0.12678531629715867], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 210.14545454545453, 138, 450, 145.0, 423.0, 424.79999999999995, 450.0, 0.25272018820761655, 0.4471962705392589, 0.12290493528065725], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1393.2909090909093, 970, 2102, 1392.0, 1741.3999999999999, 1930.8, 2102.0, 0.25160455084013045, 226.3942171195739, 0.12629369055842485], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 12, 0, 0.0, 147.58333333333334, 143, 160, 145.0, 158.5, 160.0, 160.0, 0.13046456256319378, 0.09746620152426097, 0.04637607497363529], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 8, 4.678362573099415, 214.4912280701754, 141, 1589, 150.0, 346.00000000000006, 446.20000000000005, 990.680000000001, 0.7037384562200603, 1.5128423587275914, 0.3384096835543319], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a98087c-9777-49f1-8d68-04f6c420dafc", 3, 0, 0.0, 455.66666666666663, 270, 824, 273.0, 824.0, 824.0, 824.0, 0.03157230056830141, 0.026320527915175754, 0.02024655993475058], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 153.55555555555554, 144, 175, 146.0, 175.0, 175.0, 175.0, 0.06229106538485497, 0.048239077002138656, 0.02214252714852266], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 147.6428571428571, 141, 160, 147.5, 159.0, 160.0, 160.0, 0.09388915714362359, 0.0761932515491711, 0.03337466132839745], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b7f6f6cf-913b-4b76-b7f7-b220c0d7129b", 3, 0, 0.0, 583.6666666666667, 247, 1230, 274.0, 1230.0, 1230.0, 1230.0, 0.04651523373904954, 0.03780876909062718, 0.02982910496937747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 569.1111111111111, 281, 902, 561.0, 902.0, 902.0, 902.0, 0.05689720571500822, 0.08817955612277152, 0.12796314918131244], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1f97df51-6571-4bb7-b09c-b1fffeb8dafc", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.34281605787476277, 1.3082601992409866], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7161db5a-2bfb-47b5-8a6e-ba285d20e18e", 1, 0, 0.0, 531.0, 531, 531, 531.0, 531.0, 531.0, 531.0, 1.8832391713747645, 0.34023363935969864, 1.298405131826742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 461.4375, 281, 846, 300.5, 844.6, 846.0, 846.0, 0.10527008355812882, 0.16314806895190473, 0.2367548851898151], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0bc40fb1-de55-45da-8c52-e75cab2a55a7", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=846fe707-a93b-4ba6-beed-5e9710074374", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 162.27777777777777, 143, 426, 145.0, 189.30000000000038, 426.0, 426.0, 0.08925737860996509, 0.07400343207017614, 0.03172820880276103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f56c4227-e37c-4b73-9bb7-c07ee8c165ad", 3, 0, 0.0, 820.6666666666666, 243, 1930, 289.0, 1930.0, 1930.0, 1930.0, 0.028928209825948605, 0.02411625825659322, 0.018550967889687093], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/33c28be4-3401-45bf-b0b3-714e324f0850", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.7865417179802955, 1.4696544027093594], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/049727d3-e6de-4c28-a6e3-8fe1ecc1c989", 3, 0, 0.0, 479.0, 334, 570, 533.0, 570.0, 570.0, 570.0, 0.027241275981366966, 0.02732108440709363, 0.01746917763128025], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 22, 0, 0.0, 159.27272727272725, 140, 427, 146.0, 153.1, 386.0499999999994, 427.0, 0.09865515091995927, 0.07659262205211682, 0.035068823178579275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/094a353b-ffa2-4763-941f-78b7f2a6c43f", 3, 0, 0.0, 1195.3333333333333, 224, 1711, 1651.0, 1711.0, 1711.0, 1711.0, 0.04561211457763181, 0.029591453239980536, 0.029249956288390194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b814630c-e55c-49d2-9400-1b652a2ce46b", 3, 0, 0.0, 385.0, 321, 506, 328.0, 506.0, 506.0, 506.0, 0.016665000166650002, 0.022974048081302982, 0.010686865341243653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 12, 0, 0.0, 173.25, 139, 469, 142.0, 383.8000000000003, 469.0, 469.0, 0.140462590130162, 0.10438674911040359, 0.07050563606142897], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 12, 0, 0.0, 211.16666666666669, 138, 424, 141.5, 424.0, 424.0, 424.0, 0.140462590130162, 0.09032677304756999, 0.07715840522286731], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 12, 0, 0.0, 530.9166666666666, 139, 1517, 278.5, 1474.4, 1517.0, 1517.0, 0.13846579894765992, 31.175932967408613, 0.078427893935198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 12, 0, 0.0, 476.91666666666663, 138, 1136, 414.5, 1128.8, 1136.0, 1136.0, 0.1389049658525292, 10.238747431705058, 0.0788122901956245], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 25.0, 0.46367851622874806], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 12.5, 0.23183925811437403], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.166666666666667, 0.07727975270479134], "isController": false}, {"data": ["401/Unauthorized", 14, 58.333333333333336, 1.0819165378670788], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1294, 24, "401/Unauthorized", 14, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
