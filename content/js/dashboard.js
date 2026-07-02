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

    var data = {"OkPercent": 98.2919254658385, "KoPercent": 1.7080745341614907};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.774365821094793, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.06363636363636363, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3377d69a-8f15-4b6c-939f-b1777aaf410d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=088ce878-a780-48a8-a3a2-c559b765a121"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/de1de71c-d471-4679-a299-0875ef8f93c2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b67fac42-643b-4661-8fce-1899b33f4588"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be631440-5319-4fb0-aebb-5745c7bcc390"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9b7ba51e-7abe-46e6-ae0f-f4cb6b1c1316"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4a0b4f43-ff11-4e38-ba63-556ae196462f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/273226d4-ff73-4bce-86cc-8b4f6b64e485"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aa52d3b7-b76f-4814-874a-bfdc79fc1311"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=31fcdb7a-d03d-4c65-9a61-9298586187cc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9b7ba51e-7abe-46e6-ae0f-f4cb6b1c1316"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9fecabe0-517f-4ec6-94cf-bed4c8ac766e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e62a63af-b21b-4c84-8769-42cb22dae042"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8f71b928-9061-4de6-ba81-6f48dbde78c7"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a0b4f43-ff11-4e38-ba63-556ae196462f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/aa52d3b7-b76f-4814-874a-bfdc79fc1311"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=149a9b60-bbb8-456f-9464-f148ddae060b"], "isController": false}, {"data": [0.35454545454545455, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3377d69a-8f15-4b6c-939f-b1777aaf410d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.325, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/088ce878-a780-48a8-a3a2-c559b765a121"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b67fac42-643b-4661-8fce-1899b33f4588"], "isController": false}, {"data": [0.2711864406779661, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4818181818181818, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/be631440-5319-4fb0-aebb-5745c7bcc390"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9161849710982659, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/ff518879-b4f6-4ff5-9293-c19fb48ab8e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e62a63af-b21b-4c84-8769-42cb22dae042"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/31fcdb7a-d03d-4c65-9a61-9298586187cc"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9fecabe0-517f-4ec6-94cf-bed4c8ac766e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/149a9b60-bbb8-456f-9464-f148ddae060b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8f71b928-9061-4de6-ba81-6f48dbde78c7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1288, 22, 1.7080745341614907, 393.5729813664594, 101, 2386, 124.5, 1133.1000000000001, 1358.55, 1764.11, 5.088877562712119, 712.335491346587, 3.7205842479879574], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1843.018181818182, 1318, 2516, 1874.0, 2173.4, 2310.399999999999, 2516.0, 0.24615549866628478, 296.2081248937056, 1.2103446638522888], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3377d69a-8f15-4b6c-939f-b1777aaf410d", 3, 0, 0.0, 324.6666666666667, 198, 463, 313.0, 463.0, 463.0, 463.0, 0.026538104294749877, 0.026615852647175902, 0.017018250475474367], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=088ce878-a780-48a8-a3a2-c559b765a121", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de1de71c-d471-4679-a299-0875ef8f93c2", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 0.6666721033402923, 1.245677844467641], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b67fac42-643b-4661-8fce-1899b33f4588", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.4250919117647059, 1.6222426470588236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be631440-5319-4fb0-aebb-5745c7bcc390", 1, 0, 0.0, 931.0, 931, 931, 931.0, 931.0, 931.0, 931.0, 1.0741138560687433, 0.19405377282491942, 0.7405511546723952], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 559.0769230769231, 112, 975, 500.0, 947.0, 975.0, 975.0, 0.09660256219718812, 0.018301657291264154, 0.06530397064396753], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 559.0769230769231, 112, 975, 500.0, 947.0, 975.0, 975.0, 0.09602529158449118, 0.018192291569718053, 0.06491373189369262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 183.49999999999997, 104, 349, 115.5, 345.5, 349.0, 349.0, 0.0973431406547543, 0.02604689505801043, 0.055516009904664564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 127.62499999999999, 108, 331, 115.5, 184.70000000000016, 331.0, 331.0, 0.09733188957697127, 0.07233356246882339, 0.04885604613531566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 175.625, 104, 448, 115.5, 373.1000000000001, 448.0, 448.0, 0.09733603440828817, 0.02623510302410892, 0.05731799682441188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 126.31250000000001, 107, 323, 114.0, 190.70000000000013, 323.0, 323.0, 0.09734017959263135, 0.026236220280826415, 0.057225379018324286], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b7ba51e-7abe-46e6-ae0f-f4cb6b1c1316", 3, 0, 0.0, 332.6666666666667, 221, 391, 386.0, 391.0, 391.0, 391.0, 0.03485697023214743, 0.029058821863453627, 0.02235293989496433], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 322.0, 120, 1307, 222.5, 877.5, 1307.0, 1307.0, 0.09214830611667292, 0.19216418524442339, 0.059566012331417964], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 12, 0, 0.0, 115.08333333333333, 110, 122, 114.0, 120.80000000000001, 122.0, 122.0, 0.07817844229453728, 0.058099408775530145, 0.03924191341737516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 12, 0, 0.0, 168.25, 105, 344, 114.0, 342.2, 344.0, 344.0, 0.07818149834841585, 0.0307050708845585, 0.044040717087217976], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 723.4, 650, 856, 684.0, 856.0, 856.0, 856.0, 0.09809499519334523, 28.84318564723078, 0.05594480194620471], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1217.6, 1123, 1324, 1229.0, 1324.0, 1324.0, 1324.0, 0.09694243558175156, 87.2289739430851, 0.055192812445469884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a0b4f43-ff11-4e38-ba63-556ae196462f", 3, 0, 0.0, 313.0, 229, 464, 246.0, 464.0, 464.0, 464.0, 0.07911809694604145, 0.03579887850097579, 0.050736540033757056], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 282.0, 108, 341, 323.0, 341.0, 341.0, 341.0, 0.09874397661742633, 0.1747305523738052, 0.05467561986531321], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 19, 0, 0.0, 122.89473684210527, 105, 320, 113.0, 116.0, 320.0, 320.0, 0.09008710000142243, 0.06694949521590085, 0.04521950136790149], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/273226d4-ff73-4bce-86cc-8b4f6b64e485", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 1.4384501689189189, 2.68774634009009], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 19, 0, 0.0, 169.3684210526316, 106, 345, 112.0, 343.0, 345.0, 345.0, 0.08999066938848972, 0.038307089014981074, 0.05052724467515736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 19, 0, 0.0, 257.6842105263158, 107, 1339, 113.0, 1239.0, 1339.0, 1339.0, 0.09008411011123016, 8.554128919251449, 0.05214469819452479], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 19, 0, 0.0, 211.3157894736842, 104, 807, 114.0, 673.0, 807.0, 807.0, 0.08999535813415939, 2.807137283182236, 0.05218121068623829], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 179.6, 114, 440, 114.0, 440.0, 440.0, 440.0, 0.09918666931164452, 0.07371196811148582, 0.05569563950605039], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 845.6250000000002, 108, 1455, 1220.0, 1389.9, 1455.0, 1455.0, 0.07597196634441891, 42.7324968453828, 0.040582681240622205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 12, 0, 0.0, 168.75, 108, 792, 112.5, 589.2000000000007, 792.0, 792.0, 0.07818149834841585, 5.881637130755299, 0.04540227638462691], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 568.2499999999999, 107, 1018, 750.0, 933.3000000000001, 1018.0, 1018.0, 0.07597268781872916, 13.969236848415495, 0.04065725871549178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 12, 0, 0.0, 196.16666666666663, 108, 646, 114.5, 558.7000000000003, 646.0, 646.0, 0.07817844229453728, 1.9349037224339554, 0.045476847780057984], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 563.1538461538461, 113, 990, 467.0, 966.4, 990.0, 990.0, 0.09607780824347595, 0.01820224101487728, 0.0657142761460974], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aa52d3b7-b76f-4814-874a-bfdc79fc1311", 1, 0, 0.0, 892.0, 892, 892, 892.0, 892.0, 892.0, 892.0, 1.1210762331838564, 0.20253818665919282, 0.7729295123318386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 19, 0, 0.0, 418.7894736842105, 220, 1446, 230.0, 1354.0, 1446.0, 1446.0, 0.08994508615792464, 11.45162844247065, 0.19986615490674114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 792.4499999999999, 162, 1847, 711.0, 1621.8000000000002, 1836.0499999999997, 1847.0, 0.10257304482954925, 0.06300629413846336, 0.04637824194929814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 114.0, 109, 120, 114.0, 120.0, 120.0, 120.0, 0.07597124488381148, 0.05645909898103568, 0.038134003779569436], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=31fcdb7a-d03d-4c65-9a61-9298586187cc", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.3868609475374732, 1.476345021413276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 155.24999999999997, 107, 354, 115.0, 343.5, 354.0, 354.0, 0.07597268781872916, 0.09164576428523946, 0.03934034933191517], "isController": false}, {"data": ["login", 20, 0, 0.0, 2972.6000000000004, 1797, 4313, 2844.0, 4298.8, 4312.9, 4313.0, 0.1030662200463798, 30.9670963105514, 0.19823136755990722], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 12, 0, 0.0, 116.66666666666667, 110, 125, 117.0, 123.5, 125.0, 125.0, 0.07830240388379923, 0.06339130158170855, 0.027834057630569255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9b7ba51e-7abe-46e6-ae0f-f4cb6b1c1316", 1, 0, 0.0, 807.0, 807, 807, 807.0, 807.0, 807.0, 807.0, 1.2391573729863692, 0.22387120508054523, 0.8543409231722429], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9fecabe0-517f-4ec6-94cf-bed4c8ac766e", 1, 0, 0.0, 990.0, 990, 990, 990.0, 990.0, 990.0, 990.0, 1.0101010101010102, 0.18248895202020202, 0.696417297979798], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e62a63af-b21b-4c84-8769-42cb22dae042", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.4059866573033708, 1.5493328651685394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 962.0625000000001, 221, 1575, 1333.0, 1509.2, 1575.0, 1575.0, 0.07593158564133716, 56.819488746108505, 0.15862953572581104], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8f71b928-9061-4de6-ba81-6f48dbde78c7", 1, 0, 0.0, 621.0, 621, 621, 621.0, 621.0, 621.0, 621.0, 1.6103059581320451, 0.29092441626409016, 1.1102304750402576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 348.31249999999994, 225, 668, 250.0, 595.9000000000001, 668.0, 668.0, 0.097263255157992, 0.15073904876536454, 0.21874734045786676], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 1031.142857142857, 109, 1765, 1245.0, 1765.0, 1765.0, 1765.0, 0.08196241437854927, 70.0459392014519, 0.14752777208594345], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1146.8695652173915, 245, 1786, 1029.0, 1734.8, 1776.3999999999999, 1786.0, 0.09202282165977163, 0.02899156490809721, 0.04151810899102978], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a0b4f43-ff11-4e38-ba63-556ae196462f", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 0.6593578923357664, 2.5162522810218975], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 120.83333333333333, 106, 151, 117.0, 147.4, 151.0, 151.0, 0.10407632263660017, 0.08080144189071986, 0.036995880312228974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 12, 0, 0.0, 362.25, 219, 914, 233.5, 780.8000000000004, 914.0, 914.0, 0.07811991406809451, 7.899196066743701, 0.1740278749755875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aa52d3b7-b76f-4814-874a-bfdc79fc1311", 3, 0, 0.0, 408.0, 256, 504, 464.0, 504.0, 504.0, 504.0, 0.02352129461205545, 0.027801373937621526, 0.015083642703694411], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 454.16666666666663, 215, 1704, 445.0, 783.3000000000014, 1704.0, 1704.0, 0.12998360762281644, 8.829456711396674, 0.29048853977859457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 124.77777777777777, 111, 205, 114.0, 205.0, 205.0, 205.0, 0.04228667546855986, 0.03142593753083404, 0.021225928897304458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 112.0, 108, 121, 110.0, 121.0, 121.0, 121.0, 0.042289258528333803, 0.011315680504651818, 0.024118092754440372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 112.11111111111113, 108, 115, 113.0, 115.0, 115.0, 115.0, 0.0422904508162057, 0.011398598071555443, 0.02486215956187093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 111.66666666666667, 109, 119, 110.0, 119.0, 119.0, 119.0, 0.04229005337944516, 0.011398490949928577, 0.024903224792778737], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 113.0, 113, 113, 113.0, 113.0, 113.0, 113.0, 8.849557522123893, 2.609928097345133, 5.470478429203539], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=149a9b60-bbb8-456f-9464-f148ddae060b", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1285.9818181818177, 859, 2027, 1215.0, 1691.8, 1806.799999999999, 2027.0, 0.23962113719834965, 286.67018587520533, 0.4731581439600225], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1146.8695652173915, 245, 1786, 1029.0, 1734.8, 1776.3999999999999, 1786.0, 0.09129121500668808, 0.028761074021298638, 0.04118802864559559], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3377d69a-8f15-4b6c-939f-b1777aaf410d", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 110.16666666666666, 103, 114, 112.0, 114.0, 114.0, 114.0, 0.043953145946421114, 0.011846746368371318, 0.02588256543524603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 111.0, 107, 115, 111.0, 115.0, 115.0, 115.0, 0.04395282396894, 0.011846659585378361, 0.025839453153615122], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 198.55555555555554, 106, 1223, 111.5, 430.1000000000013, 1223.0, 1223.0, 0.10134279199391943, 5.091821012090758, 0.05909463586971821], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 172.66666666666666, 107, 679, 113.5, 436.0000000000004, 679.0, 679.0, 0.10134108029591596, 1.68122169135448, 0.0591926036494049], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 126.11111111111114, 109, 337, 115.0, 139.90000000000032, 337.0, 337.0, 0.10133765707336846, 0.07531050491487637, 0.050866753648155655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 110.83333333333334, 108, 114, 110.5, 114.0, 114.0, 114.0, 0.043951536106186906, 0.011760469622163294, 0.02506611043555972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 160.27777777777777, 105, 343, 114.5, 327.70000000000005, 343.0, 343.0, 0.10134279199391943, 0.03557334332685865, 0.057324216000900825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 111.66666666666667, 109, 114, 111.5, 114.0, 114.0, 114.0, 0.04395185806479969, 0.032663441393859925, 0.022061772505182656], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 244.66666666666666, 114, 450, 222.0, 450.0, 450.0, 450.0, 0.0420539131166155, 0.033101029269523526, 0.014948851928171915], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 623.6153846153845, 109, 1596, 464.0, 1554.0, 1596.0, 1596.0, 0.09702071765478536, 0.01817680813033614, 0.06603122761060362], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1488.4000000000003, 948, 2386, 1358.0, 2262.3000000000006, 2381.2, 2386.0, 0.10289071462745844, 0.053253983156790016, 0.04732570956009075], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/088ce878-a780-48a8-a3a2-c559b765a121", 3, 0, 0.0, 894.3333333333334, 208, 1721, 754.0, 1721.0, 1721.0, 1721.0, 0.029874526986656044, 0.02490516393646684, 0.0191578184126668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 225.66666666666666, 223, 230, 225.0, 230.0, 230.0, 230.0, 0.04391518513910135, 0.06805995978100961, 0.09876628063999063], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b67fac42-643b-4661-8fce-1899b33f4588", 3, 0, 0.0, 282.3333333333333, 194, 453, 200.0, 453.0, 453.0, 453.0, 0.034914169333721275, 0.02858370308408496, 0.022389620308408496], "isController": false}, {"data": ["addBook", 59, 12, 20.338983050847457, 1145.2542372881355, 550, 2729, 924.0, 2009.0, 2205.0, 2729.0, 0.2841319528052011, 87.53572812575247, 1.0325037999638815], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 208.6545454545455, 104, 484, 116.0, 460.4, 468.2, 484.0, 0.24040668068310467, 0.17866160546859633, 0.11621221380677423], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 737.036363636364, 529, 1140, 675.0, 1015.0, 1038.5999999999997, 1140.0, 0.24028064779662645, 70.65048852059205, 0.12084427110865491], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 172.7272727272727, 101, 487, 116.0, 338.4, 373.39999999999986, 487.0, 0.24061071373887175, 0.4257681770457379, 0.11701575726753724], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1074.7454545454543, 749, 1565, 1078.0, 1330.0, 1405.5999999999995, 1565.0, 0.24016628240061483, 216.1020430713665, 0.1205522159706211], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be631440-5319-4fb0-aebb-5745c7bcc390", 3, 0, 0.0, 321.6666666666667, 224, 420, 321.0, 420.0, 420.0, 420.0, 0.02646272724867025, 0.026540254769906586, 0.016969912981731897], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 123.16666666666667, 110, 204, 118.0, 141.9000000000001, 204.0, 204.0, 0.13029315960912052, 0.09733815146579804, 0.04631514657980456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 12, 6.936416184971098, 183.26589595375722, 106, 2269, 120.0, 313.59999999999997, 358.7999999999992, 1004.3399999999845, 0.7230416229567804, 1.5572463241901306, 0.3475458379132935], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 125.77777777777777, 116, 157, 124.0, 157.0, 157.0, 157.0, 0.04411051153489877, 0.03415980043669407, 0.015679908397171045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 119.25000000000003, 111, 129, 118.0, 126.9, 129.0, 129.0, 0.09771589104678148, 0.07929873580065958, 0.0347349456455356], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ff518879-b4f6-4ff5-9293-c19fb48ab8e9", 2, 0, 0.0, 818.0, 329, 1307, 818.0, 1307.0, 1307.0, 1307.0, 0.02642391893141672, 0.030423633222793275, 0.016424633202975335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 239.88888888888889, 223, 327, 227.0, 327.0, 327.0, 327.0, 0.04226383905930087, 0.06550069588585006, 0.09505236460309559], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e62a63af-b21b-4c84-8769-42cb22dae042", 3, 0, 0.0, 737.0, 268, 1596, 347.0, 1596.0, 1596.0, 1596.0, 0.026211632722602293, 0.02628842461534429, 0.016808892077970868], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/31fcdb7a-d03d-4c65-9a61-9298586187cc", 3, 0, 0.0, 641.3333333333333, 210, 1491, 223.0, 1491.0, 1491.0, 1491.0, 0.022316779242419735, 0.02637767754857619, 0.014311215855327759], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 367.3333333333333, 221, 1339, 232.0, 807.1000000000008, 1339.0, 1339.0, 0.10127436914507552, 6.87931097385152, 0.22632887444791402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9fecabe0-517f-4ec6-94cf-bed4c8ac766e", 3, 0, 0.0, 657.6666666666666, 334, 1081, 558.0, 1081.0, 1081.0, 1081.0, 0.022142018909284147, 0.02220688810530744, 0.014199146240654222], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/149a9b60-bbb8-456f-9464-f148ddae060b", 3, 0, 0.0, 396.3333333333333, 246, 495, 448.0, 495.0, 495.0, 495.0, 0.03546686212848462, 0.029567263642919634, 0.022744048956092024], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 19, 0, 0.0, 143.10526315789477, 110, 346, 118.0, 344.0, 346.0, 346.0, 0.08936424395497923, 0.07409203429470446, 0.03176619609337152], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 119.5625, 105, 141, 118.0, 131.20000000000002, 141.0, 141.0, 0.07630675314765356, 0.059242059328500574, 0.027124666157954978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8f71b928-9061-4de6-ba81-6f48dbde78c7", 3, 0, 0.0, 322.6666666666667, 212, 409, 347.0, 409.0, 409.0, 409.0, 0.033586726525677055, 0.02799987195060512, 0.021538363038927016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 139.38888888888886, 102, 357, 115.0, 342.6, 357.0, 357.0, 0.13030353484533697, 0.0968369043137709, 0.06540626651416327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 209.94444444444443, 108, 342, 117.5, 341.1, 342.0, 342.0, 0.13031013812874642, 0.04574146016129499, 0.07370949979005588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 253.88888888888894, 103, 1345, 114.0, 442.30000000000143, 1345.0, 1345.0, 0.1303044781305651, 6.5469587590851175, 0.07598266769462421], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 212.83333333333331, 104, 673, 115.0, 477.70000000000033, 673.0, 673.0, 0.13009258255458467, 2.158201501665908, 0.07598615146390292], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 27.272727272727273, 0.4658385093167702], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.545454545454546, 0.07763975155279502], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.545454545454546, 0.07763975155279502], "isController": false}, {"data": ["401/Unauthorized", 14, 63.63636363636363, 1.0869565217391304], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1288, 22, "401/Unauthorized", 14, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
