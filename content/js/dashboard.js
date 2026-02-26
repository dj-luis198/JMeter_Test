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

    var data = {"OkPercent": 98.57571214392803, "KoPercent": 1.424287856071964};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7745795601552393, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2efcb744-5536-41a1-9074-f9f231b07bfb"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4bd5ddaa-d9c7-47eb-bac6-2f9ffc5eddec"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ffc49bbc-c359-414d-9d57-09c8db141bcb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5290b600-4439-4c9a-8a69-6a437288c956"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3c5fe46-6661-4e00-b4bf-bb937b2bccc2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/680f1163-fac1-4fbf-931a-054985d6a283"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c83c840e-7229-4d03-889c-6320765ae46f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/902fe315-992a-4f63-9475-26e6b922e490"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c83c840e-7229-4d03-889c-6320765ae46f"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.05, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d3c5fe46-6661-4e00-b4bf-bb937b2bccc2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5c2c808f-71f9-4d80-8807-791f129a1d3c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ffc49bbc-c359-414d-9d57-09c8db141bcb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3967c933-54f8-4618-8e9d-e54c474c87f0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e05df60d-9589-48a8-91c1-1ed52f13330a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=14ef8108-8050-4b34-ae94-b9422decd469"], "isController": false}, {"data": [0.6176470588235294, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "register"], "isController": true}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5290b600-4439-4c9a-8a69-6a437288c956"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=902fe315-992a-4f63-9475-26e6b922e490"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2efcb744-5536-41a1-9074-f9f231b07bfb"], "isController": false}, {"data": [0.3706896551724138, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=680f1163-fac1-4fbf-931a-054985d6a283"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/14ef8108-8050-4b34-ae94-b9422decd469"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4bd5ddaa-d9c7-47eb-bac6-2f9ffc5eddec"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5c2c808f-71f9-4d80-8807-791f129a1d3c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/50051b72-20dd-4a70-94e5-e090503a5ff5"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3967c933-54f8-4618-8e9d-e54c474c87f0"], "isController": false}, {"data": [0.31666666666666665, 500, 1500, "addBook"], "isController": true}, {"data": [0.9137931034482759, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9466292134831461, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e05df60d-9589-48a8-91c1-1ed52f13330a"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ba954fe6-accf-4762-9f33-0c4eb6b5f434"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1334, 19, 1.424287856071964, 402.1071964017993, 129, 2169, 154.0, 1046.0, 1220.0, 1626.500000000001, 5.277525022747953, 741.7505716350338, 3.8717687707698696], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1987.0862068965512, 1592, 2752, 1968.5, 2332.1, 2422.2999999999997, 2752.0, 0.24080978518106405, 289.7751456471036, 1.1840598324088452], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2efcb744-5536-41a1-9074-f9f231b07bfb", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 0.45507320528967254, 1.7366577455919394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4bd5ddaa-d9c7-47eb-bac6-2f9ffc5eddec", 3, 0, 0.0, 481.66666666666663, 234, 944, 267.0, 944.0, 944.0, 944.0, 0.07997014447939436, 0.03618440782108013, 0.051282937703257446], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 469.76923076923083, 156, 648, 468.0, 642.8, 648.0, 648.0, 0.06533812479581837, 0.012378511924207775, 0.044169004284673186], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 469.76923076923083, 156, 648, 468.0, 642.8, 648.0, 648.0, 0.06494577028181468, 0.012304179135421922, 0.043903770039517], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ffc49bbc-c359-414d-9d57-09c8db141bcb", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 217.17647058823533, 132, 419, 138.0, 419.0, 419.0, 419.0, 0.09815242494226328, 0.03493522661662818, 0.05549265661085451], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 152.94117647058823, 129, 414, 137.0, 199.5999999999998, 414.0, 414.0, 0.09831420061880115, 0.07306358073330828, 0.049349120232484174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 210.82352941176472, 130, 915, 135.0, 498.99999999999966, 915.0, 915.0, 0.0981677282255317, 1.7228188177429506, 0.05731150172082253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 228.23529411764707, 130, 892, 138.0, 518.3999999999996, 892.0, 892.0, 0.09831590635699083, 5.228753688653766, 0.057301998270796704], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5290b600-4439-4c9a-8a69-6a437288c956", 3, 0, 0.0, 537.6666666666667, 231, 1051, 331.0, 1051.0, 1051.0, 1051.0, 0.019562198008568243, 0.02346572254608528, 0.012544768905234193], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 231.92857142857147, 142, 290, 233.0, 270.5, 290.0, 290.0, 0.06459441627410178, 0.14698654071524475, 0.04175477508454948], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3c5fe46-6661-4e00-b4bf-bb937b2bccc2", 1, 0, 0.0, 288.0, 288, 288, 288.0, 288.0, 288.0, 288.0, 3.472222222222222, 0.6273057725694445, 2.393934461805556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/680f1163-fac1-4fbf-931a-054985d6a283", 3, 0, 0.0, 413.3333333333333, 240, 552, 448.0, 552.0, 552.0, 552.0, 0.018452794675753642, 0.02181057860275439, 0.011833335127355038], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 177.4705882352941, 131, 511, 140.0, 450.19999999999993, 511.0, 511.0, 0.09658212889737296, 0.07177636727627035, 0.04847970141918917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 206.88235294117646, 131, 524, 140.0, 449.5999999999999, 524.0, 524.0, 0.09657554479969097, 0.0429064374701752, 0.0541240243029518], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 898.8333333333333, 657, 1091, 928.0, 1091.0, 1091.0, 1091.0, 0.04782400765184123, 14.061846156145386, 0.0272746293639407], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1081.5, 906, 1273, 1072.5, 1273.0, 1273.0, 1273.0, 0.047701578922262323, 42.92196456468334, 0.027158223155936464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 267.6666666666667, 133, 409, 264.5, 409.0, 409.0, 409.0, 0.04813748064472133, 0.08518077629710454, 0.02665424953667675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 141.26666666666668, 130, 154, 141.0, 151.6, 154.0, 154.0, 0.06846345192724616, 0.05087957706702572, 0.034365443643168486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 174.8, 130, 428, 140.0, 409.40000000000003, 428.0, 428.0, 0.06846751444664556, 0.018320409139043828, 0.03904787933285254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 173.4, 131, 417, 138.0, 402.0, 417.0, 417.0, 0.06846657689937695, 0.018453882054910192, 0.04025085868498528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 154.26666666666668, 130, 398, 136.0, 247.4000000000001, 398.0, 398.0, 0.0684672019280364, 0.018454050519666063, 0.04031808863535737], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c83c840e-7229-4d03-889c-6320765ae46f", 2, 0, 0.0, 350.0, 233, 467, 350.0, 467.0, 467.0, 467.0, 0.012772697082715986, 0.025258507414550657, 0.007939278997215552], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/902fe315-992a-4f63-9475-26e6b922e490", 3, 0, 0.0, 444.0, 228, 734, 370.0, 734.0, 734.0, 734.0, 0.021733145945319405, 0.02606987070589258, 0.013936945804778392], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 135.33333333333331, 132, 142, 134.0, 142.0, 142.0, 142.0, 0.048137866850660294, 0.035774332688820784, 0.027030540467900068], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 766.8823529411765, 134, 1362, 996.0, 1314.8, 1362.0, 1362.0, 0.08494945507423084, 44.97276269057411, 0.04564666835732739], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 275.0588235294118, 131, 1193, 137.0, 1184.2, 1193.0, 1193.0, 0.09658212889737296, 10.247059837599991, 0.05580325439164622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 622.8235294117648, 130, 1109, 670.0, 1094.6, 1109.0, 1109.0, 0.0849503040721178, 14.702492791716846, 0.045730083838454505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 239.88235294117644, 130, 915, 134.0, 871.8, 915.0, 915.0, 0.09658322633426887, 3.363990222368675, 0.055898208026066105], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 465.84615384615387, 150, 929, 466.0, 802.1999999999998, 929.0, 929.0, 0.06491528555235418, 0.01229840370816085, 0.044400065726726626], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 338.19999999999993, 263, 573, 290.0, 561.6, 573.0, 573.0, 0.06842191690842411, 0.10604060755241118, 0.15388249476572335], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c83c840e-7229-4d03-889c-6320765ae46f", 1, 0, 0.0, 574.0, 574, 574, 574.0, 574.0, 574.0, 574.0, 1.7421602787456445, 0.3147457534843206, 1.2011378484320558], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 483.34999999999997, 213, 967, 423.0, 827.5000000000001, 960.1999999999999, 967.0, 0.08832868871645166, 0.05425658711196103, 0.0399376785895675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 158.52941176470588, 133, 409, 138.0, 250.59999999999985, 409.0, 409.0, 0.08494860609331355, 0.06313075120801914, 0.042640218292932776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 217.47058823529412, 132, 410, 141.0, 410.0, 410.0, 410.0, 0.08494775712936543, 0.09778166115339067, 0.04425012992009914], "isController": false}, {"data": ["login", 20, 0, 0.0, 2447.2999999999997, 1348, 3190, 2551.5, 3071.3, 3184.45, 3190.0, 0.08906305664410402, 32.08582721488689, 0.1786827573922337], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d3c5fe46-6661-4e00-b4bf-bb937b2bccc2", 3, 0, 0.0, 498.0, 249, 921, 324.0, 921.0, 921.0, 921.0, 0.10298661174047374, 0.046598759869550296, 0.06604284672159286], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 143.11764705882354, 133, 165, 141.0, 152.2, 165.0, 165.0, 0.09229549760846079, 0.0747196948412246, 0.032808165165507545], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c2c808f-71f9-4d80-8807-791f129a1d3c", 3, 0, 0.0, 514.0, 229, 798, 515.0, 798.0, 798.0, 798.0, 0.022055093623872434, 0.02211970815597362, 0.014143403137704654], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ffc49bbc-c359-414d-9d57-09c8db141bcb", 3, 0, 0.0, 472.3333333333333, 230, 622, 565.0, 622.0, 622.0, 622.0, 0.024867992406972985, 0.02939312513988246, 0.01594724773494036], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3967c933-54f8-4618-8e9d-e54c474c87f0", 1, 0, 0.0, 612.0, 612, 612, 612.0, 612.0, 612.0, 612.0, 1.6339869281045751, 0.29520271650326796, 1.1265573937908497], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e05df60d-9589-48a8-91c1-1ed52f13330a", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=14ef8108-8050-4b34-ae94-b9422decd469", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 952.7058823529412, 271, 1507, 1144.0, 1455.0, 1507.0, 1507.0, 0.08488752403065937, 59.79240104517764, 0.17813799059995508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 433.8823529411765, 269, 1045, 289.0, 880.1999999999998, 1045.0, 1045.0, 0.09807598003865348, 7.044996863010932, 0.21909908017711366], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 983.25, 142, 1407, 1222.0, 1407.0, 1407.0, 1407.0, 0.06353492435373069, 57.01164351943771, 0.117972379680737], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 894.4090909090908, 293, 1812, 875.0, 1563.3999999999999, 1784.6999999999996, 1812.0, 0.0917381459720699, 0.028717036816185947, 0.04138967132724248], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 488.8823529411765, 268, 1693, 282.0, 1408.9999999999998, 1693.0, 1693.0, 0.09650263111585425, 13.714399797983095, 0.21413184352666026], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 197.25, 131, 474, 143.5, 444.6, 474.0, 474.0, 0.12089340224257261, 0.09385767068637228, 0.042973826578414476], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5290b600-4439-4c9a-8a69-6a437288c956", 1, 0, 0.0, 929.0, 929, 929, 929.0, 929.0, 929.0, 929.0, 1.0764262648008611, 0.19447154198062433, 0.7421454520990312], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=902fe315-992a-4f63-9475-26e6b922e490", 1, 0, 0.0, 500.0, 500, 500, 500.0, 500.0, 500.0, 500.0, 2.0, 0.361328125, 1.37890625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 371.5882352941176, 264, 680, 289.0, 599.9999999999999, 680.0, 680.0, 0.08837504288788847, 0.1369640557256631, 0.19875754274492885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 208.33333333333334, 132, 433, 141.5, 432.1, 433.0, 433.0, 0.057207419802348364, 0.042514498505456154, 0.028715443142975642], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 160.74999999999997, 130, 396, 143.0, 321.90000000000026, 396.0, 396.0, 0.05720551079754016, 0.015306943318873051, 0.032625017876722125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 202.66666666666666, 132, 540, 140.5, 530.7, 540.0, 540.0, 0.057208510719444695, 0.015419481404850329, 0.03363234712217354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 217.0, 131, 575, 137.0, 524.3000000000002, 575.0, 575.0, 0.05720578350471233, 0.015418746335254493, 0.03368660884115384], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 150.0, 150, 150, 150.0, 150.0, 150.0, 150.0, 6.666666666666667, 1.9661458333333335, 4.12109375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2efcb744-5536-41a1-9074-f9f231b07bfb", 3, 0, 0.0, 346.6666666666667, 290, 445, 305.0, 445.0, 445.0, 445.0, 0.09552923194497516, 0.04322448971468603, 0.061260607725130554], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1293.5172413793105, 1036, 2169, 1153.0, 1699.9, 1772.35, 2169.0, 0.24031290397427824, 287.49777943625907, 0.47452411312108456], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 894.4090909090908, 293, 1812, 875.0, 1563.3999999999999, 1784.6999999999996, 1812.0, 0.09001268360541713, 0.028176910723783807, 0.040611191236037805], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=680f1163-fac1-4fbf-931a-054985d6a283", 1, 0, 0.0, 569.0, 569, 569, 569.0, 569.0, 569.0, 569.0, 1.757469244288225, 0.3175115333919157, 1.2116926625659052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 173.00000000000003, 132, 398, 134.0, 398.0, 398.0, 398.0, 0.06663113006396588, 0.017959171775053306, 0.03923688616071429], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 139.42857142857142, 131, 149, 141.0, 149.0, 149.0, 149.0, 0.06662542235758816, 0.017957633369818683, 0.03916846119069148], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/14ef8108-8050-4b34-ae94-b9422decd469", 3, 0, 0.0, 557.3333333333334, 212, 1015, 445.0, 1015.0, 1015.0, 1015.0, 0.02142000342720055, 0.02531771889458502, 0.0137361350102816], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4bd5ddaa-d9c7-47eb-bac6-2f9ffc5eddec", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 0.7140872035573123, 2.7251111660079053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 256.375, 131, 1220, 139.0, 673.3000000000005, 1220.0, 1220.0, 0.11564537346227793, 6.532841309701923, 0.06736568874047733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 235.0, 130, 653, 142.0, 480.1000000000002, 653.0, 653.0, 0.11563868692271, 2.154321069910814, 0.0674747221057805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 181.42857142857142, 136, 421, 142.0, 421.0, 421.0, 421.0, 0.0666298616002589, 0.017828693436006775, 0.03799984294389765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 154.375, 131, 399, 137.0, 224.00000000000017, 399.0, 399.0, 0.11564871702204554, 0.08594597036501626, 0.05805023491145645], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5c2c808f-71f9-4d80-8807-791f129a1d3c", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.3687021683673469, 1.407047193877551], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 145.28571428571428, 133, 171, 142.0, 171.0, 171.0, 171.0, 0.06662859318484675, 0.049515975989910525, 0.03344443056348753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 236.18750000000003, 131, 441, 137.0, 421.40000000000003, 441.0, 441.0, 0.1156495529421969, 0.041801553498760385, 0.06534933844841669], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 602.1666666666667, 145, 1051, 502.0, 1018.9000000000001, 1051.0, 1051.0, 0.06523121748631504, 0.012257395929028435, 0.04439523696598735], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 147.99999999999997, 139, 163, 147.0, 163.0, 163.0, 163.0, 0.06384240047425783, 0.050250951935792786, 0.022693978293583838], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50051b72-20dd-4a70-94e5-e090503a5ff5", 2, 0, 0.0, 225.0, 205, 245, 225.0, 245.0, 245.0, 245.0, 0.014608456835662165, 0.024708835194694207, 0.009080354273338835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1282.1499999999999, 815, 1951, 1196.5, 1868.8000000000004, 1947.6499999999999, 1951.0, 0.08954796188838743, 0.046348066211763024, 0.04118856450139695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 328.42857142857144, 274, 555, 295.0, 555.0, 555.0, 555.0, 0.06653676156076231, 0.10311898495793927, 0.14964273620550353], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3967c933-54f8-4618-8e9d-e54c474c87f0", 3, 0, 0.0, 319.3333333333333, 218, 489, 251.0, 489.0, 489.0, 489.0, 0.025445508443667886, 0.03007572954393167, 0.016317594932951086], "isController": false}, {"data": ["addBook", 60, 8, 13.333333333333334, 1212.266666666667, 688, 2645, 1069.0, 2089.9, 2243.4999999999995, 2645.0, 0.28728615137107316, 81.26067877787274, 1.0470373840082163], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 269.5172413793104, 131, 765, 146.0, 571.9, 585.0499999999998, 765.0, 0.2414011254286951, 0.1794006410656611, 0.11669292684297272], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 786.8448275862069, 642, 1167, 703.0, 1000.4, 1106.1499999999999, 1167.0, 0.24110809956933105, 70.89378681575184, 0.12126042117012255], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 240.98275862068962, 130, 549, 143.5, 434.3, 441.99999999999994, 549.0, 0.2417996564777294, 0.42787204837660714, 0.11759397356045825], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1015.3793103448272, 898, 1373, 971.5, 1223.6, 1286.55, 1373.0, 0.24121840246874557, 217.04874255810037, 0.12108033092669455], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 158.23529411764707, 136, 398, 145.0, 201.19999999999982, 398.0, 398.0, 0.08843388786583019, 0.06606633224351571, 0.03143548357730682], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 8, 4.49438202247191, 200.43258426966287, 132, 1011, 148.5, 329.6999999999998, 406.19999999999993, 694.2100000000032, 0.7224495097084226, 1.516120574235746, 0.34736411835792913], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 148.83333333333334, 134, 169, 148.5, 165.70000000000002, 169.0, 169.0, 0.05496997265243861, 0.042569519837288884, 0.019540107466296537], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 157.8235294117647, 133, 401, 144.0, 201.79999999999984, 401.0, 401.0, 0.09692463824304139, 0.0786566156054369, 0.034453680000456115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 442.8333333333333, 276, 1006, 286.0, 983.8000000000001, 1006.0, 1006.0, 0.05716844682858042, 0.08859992687202843, 0.12857317680294988], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e05df60d-9589-48a8-91c1-1ed52f13330a", 3, 0, 0.0, 334.6666666666667, 233, 467, 304.0, 467.0, 467.0, 467.0, 0.05446721981154341, 0.035017174195246824, 0.034928523121334806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 481.5, 269, 1354, 409.0, 960.6000000000004, 1354.0, 1354.0, 0.1155242998144391, 8.805801677719694, 0.25796948443671075], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 164.26666666666668, 134, 428, 147.0, 261.80000000000007, 428.0, 428.0, 0.06776934927870823, 0.056187673376585236, 0.024089885876415813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 144.0, 134, 152, 145.0, 151.2, 152.0, 152.0, 0.08462258327857754, 0.06569819697897378, 0.03008068389980686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 139.23529411764704, 131, 150, 138.0, 148.4, 150.0, 150.0, 0.08843802835219144, 0.06572396442970478, 0.04439174470022109], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba954fe6-accf-4762-9f33-0c4eb6b5f434", 1, 0, 0.0, 336.0, 336, 336, 336.0, 336.0, 336.0, 336.0, 2.976190476190476, 0.9504045758928571, 1.7758324032738093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 208.58823529411768, 130, 548, 139.0, 455.19999999999993, 548.0, 548.0, 0.08844677065232094, 0.02366642105345307, 0.050442298887651796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 167.64705882352942, 129, 409, 134.0, 405.0, 409.0, 409.0, 0.08844354960382493, 0.023838300479155937, 0.051995133653811136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 188.05882352941177, 131, 446, 138.0, 417.2, 446.0, 446.0, 0.08844354960382493, 0.023838300479155937, 0.05208150430772112], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 36.8421052631579, 0.5247376311844077], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.2631578947368425, 0.07496251874062969], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.2631578947368425, 0.07496251874062969], "isController": false}, {"data": ["401/Unauthorized", 10, 52.63157894736842, 0.7496251874062968], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1334, 19, "401/Unauthorized", 10, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
