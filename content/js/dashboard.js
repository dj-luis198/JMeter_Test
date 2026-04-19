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

    var data = {"OkPercent": 98.13809154383243, "KoPercent": 1.8619084561675718};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7319177173191772, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/97a17502-5ab1-4041-9dca-09739b8cc63c"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=27ddabe9-135e-4330-ad54-89024b56704f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/65a1ee2c-e41c-43da-84b9-e8227f871cc0"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.46875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8f53d441-0264-4fc1-9ace-71334cd463fc"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=70145975-8e58-4b22-88da-e1c3f45999c1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3265cb48-7def-43a4-95ea-54c207da318b"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/87a609d5-a9c3-48ff-aff8-736875054a41"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6eb1bfc0-7b9f-4b6c-93b9-84562a6ada2c"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e8fac17f-3cbe-4aae-8c88-77b57b38606e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ce3dcd19-b1fc-42f9-936e-98818f49b322"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ccc72072-7ef9-4751-a3bc-a163b3e310f0"], "isController": false}, {"data": [0.40625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bab4427c-700b-4010-b03b-6632606413cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=97a17502-5ab1-4041-9dca-09739b8cc63c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/25387834-c7b9-4c5f-a2a1-c0e5d1c56d94"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b7c990e3-75db-4379-b54e-ad5c93710fd6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2037037037037037, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=65a1ee2c-e41c-43da-84b9-e8227f871cc0"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9347826086956522, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9565217391304348, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0c282a8f-a906-4747-a1b1-dcfd215e427d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ce3dcd19-b1fc-42f9-936e-98818f49b322"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.38636363636363635, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3265cb48-7def-43a4-95ea-54c207da318b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/27ddabe9-135e-4330-ad54-89024b56704f"], "isController": false}, {"data": [0.2627118644067797, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e8fac17f-3cbe-4aae-8c88-77b57b38606e"], "isController": false}, {"data": [0.8981481481481481, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=496e296b-2aa6-4c66-9ed5-47dd7d22200c"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3055555555555556, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/496e296b-2aa6-4c66-9ed5-47dd7d22200c"], "isController": false}, {"data": [0.936046511627907, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/70145975-8e58-4b22-88da-e1c3f45999c1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8f53d441-0264-4fc1-9ace-71334cd463fc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/659f5c20-581a-48d6-8cc8-06fda4d1051a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bab4427c-700b-4010-b03b-6632606413cf"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c282a8f-a906-4747-a1b1-dcfd215e427d"], "isController": false}, {"data": [0.7608695652173914, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6eb1bfc0-7b9f-4b6c-93b9-84562a6ada2c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b7c990e3-75db-4379-b54e-ad5c93710fd6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1289, 24, 1.8619084561675718, 486.74476338246717, 136, 2709, 163.0, 1371.0, 1629.0, 2148.299999999996, 5.1448254391461745, 729.1084194816359, 3.747871342194753], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2486.7222222222226, 1896, 3315, 2429.5, 2999.5, 3171.75, 3315.0, 0.22800010133337836, 274.3604146896982, 1.1210747170054298], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/97a17502-5ab1-4041-9dca-09739b8cc63c", 3, 0, 0.0, 506.0, 267, 892, 359.0, 892.0, 892.0, 892.0, 0.07436418620792226, 0.03292164493579892, 0.04768797097317932], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 486.1333333333333, 152, 860, 470.0, 822.2, 860.0, 860.0, 0.07683638971416863, 0.015052128688146706, 0.051734501459891405], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 486.1333333333333, 152, 860, 470.0, 822.2, 860.0, 860.0, 0.07686355693796086, 0.015057450704838816, 0.05175279334976505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 12, 0, 0.0, 192.83333333333334, 138, 443, 148.0, 434.90000000000003, 443.0, 443.0, 0.12237405669997961, 0.03274462064042423, 0.06979145421170711], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 12, 0, 0.0, 174.91666666666669, 141, 442, 151.0, 358.3000000000003, 442.0, 442.0, 0.12234660794029485, 0.09092360219000428, 0.06141226218878082], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 12, 0, 0.0, 217.75, 137, 442, 149.0, 441.7, 442.0, 442.0, 0.12238154486303465, 0.03298565076386481, 0.07206647612540029], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=27ddabe9-135e-4330-ad54-89024b56704f", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 0.6741196361940298, 2.572586287313433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 12, 0, 0.0, 195.5, 144, 444, 148.0, 439.5, 444.0, 444.0, 0.12236781726405956, 0.03298195074695355, 0.07193889257125376], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/65a1ee2c-e41c-43da-84b9-e8227f871cc0", 3, 0, 0.0, 375.6666666666667, 231, 556, 340.0, 556.0, 556.0, 556.0, 0.028114896209174827, 0.023438232158755446, 0.018029409352888805], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 291.5333333333333, 148, 436, 271.0, 410.8, 436.0, 436.0, 0.0765310027091975, 0.13859286271868734, 0.04946613248026776], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 162.58823529411762, 138, 411, 149.0, 204.59999999999982, 411.0, 411.0, 0.09429252870375507, 0.07007481869488047, 0.047330429447002054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 981.6, 784, 1181, 884.0, 1181.0, 1181.0, 1181.0, 0.025502527300455474, 7.498589789935683, 0.014544410101041013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 180.47058823529412, 136, 449, 147.0, 436.2, 449.0, 449.0, 0.09429566683676865, 0.041893536725388834, 0.05284630776996295], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1374.4, 985, 1868, 1326.0, 1868.0, 1868.0, 1868.0, 0.025375171916789736, 22.83262429552179, 0.014446997292469156], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 324.2, 148, 447, 428.0, 447.0, 447.0, 447.0, 0.025559497398043165, 0.04522832938013106, 0.01415257326629929], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 244.39999999999998, 143, 447, 150.0, 446.4, 447.0, 447.0, 0.08677743323922804, 0.06448986981938724, 0.04355820379390938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 223.0666666666667, 138, 445, 147.0, 444.4, 445.0, 445.0, 0.08662808829134759, 0.0405279584935953, 0.04843502748998002], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 425.7333333333333, 143, 1474, 425.0, 1353.4, 1474.0, 1474.0, 0.08677642920778905, 10.43114823655833, 0.05002073595089611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 362.33333333333337, 143, 1178, 150.0, 1006.4000000000001, 1178.0, 1178.0, 0.08662908889299575, 3.416479812534652, 0.05002040295520699], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 149.4, 146, 151, 150.0, 151.0, 151.0, 151.0, 0.025598492760746248, 0.01902387987395302, 0.014374153649833098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 1040.6250000000002, 142, 1906, 1480.0, 1880.8, 1906.0, 1906.0, 0.08737201365187713, 44.23264185153584, 0.04714163822525597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 412.52941176470586, 142, 2062, 149.0, 1929.1999999999998, 2062.0, 2062.0, 0.09415309292910272, 9.989346767918166, 0.0543998051861739], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 663.875, 142, 1332, 866.5, 1298.4, 1332.0, 1332.0, 0.0873729678958951, 14.461239423092676, 0.047227478252322215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 313.88235294117646, 139, 1139, 150.0, 799.7999999999997, 1139.0, 1139.0, 0.0942972359816065, 3.2843692624292076, 0.0545751753512572], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8f53d441-0264-4fc1-9ace-71334cd463fc", 3, 0, 0.0, 671.6666666666666, 248, 1092, 675.0, 1092.0, 1092.0, 1092.0, 0.026874255359174423, 0.031764460029024194, 0.017233816099470577], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 482.2666666666666, 150, 781, 464.0, 770.8, 781.0, 781.0, 0.0768399321759532, 0.015052822650875207, 0.05224715179984734], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=70145975-8e58-4b22-88da-e1c3f45999c1", 1, 0, 0.0, 764.0, 764, 764, 764.0, 764.0, 764.0, 764.0, 1.3089005235602096, 0.23647128599476439, 0.9024255562827225], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3265cb48-7def-43a4-95ea-54c207da318b", 3, 0, 0.0, 374.3333333333333, 295, 467, 361.0, 467.0, 467.0, 467.0, 0.019098183762724166, 0.02257340665444383, 0.012247207686382358], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 692.6, 288, 1627, 602.0, 1501.0, 1627.0, 1627.0, 0.08655510675129832, 13.922924255265436, 0.19171167231679168], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87a609d5-a9c3-48ff-aff8-736875054a41", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.6188680959302325, 1.1563559835271318], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6eb1bfc0-7b9f-4b6c-93b9-84562a6ada2c", 3, 0, 0.0, 459.33333333333337, 270, 815, 293.0, 815.0, 815.0, 815.0, 0.03109581657614329, 0.03118691760126871, 0.019941002166341888], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 532.0454545454546, 179, 845, 553.5, 819.0, 842.9, 845.0, 0.09821998598132928, 0.060332393732671984, 0.044410013192729934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 167.0625, 144, 442, 150.0, 242.5000000000002, 442.0, 442.0, 0.08737010522637048, 0.06493032234108197, 0.0438556973499555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e8fac17f-3cbe-4aae-8c88-77b57b38606e", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 255.75, 138, 452, 150.5, 444.3, 452.0, 452.0, 0.08737153653768444, 0.09719443511571267, 0.045701542244137916], "isController": false}, {"data": ["login", 22, 0, 0.0, 2561.0, 1927, 3809, 2437.5, 3713.9, 3798.2, 3809.0, 0.09577251415909556, 26.17230947935667, 0.1805937678213059], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 185.05882352941177, 142, 445, 152.0, 435.4, 445.0, 445.0, 0.09464846446785292, 0.07662458695688484, 0.03364457135380709], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ce3dcd19-b1fc-42f9-936e-98818f49b322", 1, 0, 0.0, 640.0, 640, 640, 640.0, 640.0, 640.0, 640.0, 1.5625, 0.28228759765625, 1.0772705078125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ccc72072-7ef9-4751-a3bc-a163b3e310f0", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.6002555216165413, 1.1215783599624058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1209.8125, 287, 2060, 1628.5, 2030.6000000000001, 2060.0, 2060.0, 0.08729812309035356, 58.806075616884, 0.18377150057289393], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bab4427c-700b-4010-b03b-6632606413cf", 3, 0, 0.0, 420.6666666666667, 336, 474, 452.0, 474.0, 474.0, 474.0, 0.039953121670573195, 0.03330727363227147, 0.0256209797171319], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=97a17502-5ab1-4041-9dca-09739b8cc63c", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 0.6921994731800766, 2.6415828544061304], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25387834-c7b9-4c5f-a2a1-c0e5d1c56d94", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 1.27734375, 2.38671875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 12, 0, 0.0, 442.25, 290, 886, 309.5, 798.1000000000004, 886.0, 886.0, 0.12216227221826327, 0.1893276621195154, 0.27474581339712917], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 914.2222222222222, 148, 2019, 1132.0, 2019.0, 2019.0, 2019.0, 0.04564056533446928, 30.33986294518568, 0.07061510645661864], "isController": false}, {"data": ["register", 24, 6, 25.0, 1101.7083333333333, 195, 2010, 1115.0, 1875.5, 1978.75, 2010.0, 0.09614036493280188, 0.03032552526688966, 0.04337582870991648], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b7c990e3-75db-4379-b54e-ad5c93710fd6", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 0.7404264856557378, 2.82562756147541], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 23, 0, 0.0, 176.78260869565213, 145, 446, 152.0, 325.8000000000004, 444.59999999999997, 446.0, 0.10877481721101369, 0.08444919890894129, 0.03866604830547752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 652.7647058823529, 287, 2474, 564.0, 2128.3999999999996, 2474.0, 2474.0, 0.09407389781361195, 13.369242167310427, 0.208742672957628], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 598.7058823529412, 296, 1968, 574.0, 1524.7999999999997, 1968.0, 1968.0, 0.09767476601147966, 13.880976878731033, 0.21673271982567927], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 146.875, 143, 152, 145.5, 152.0, 152.0, 152.0, 0.0400038003610343, 0.029729386791745218, 0.020080032603097295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 179.5, 142, 414, 146.0, 414.0, 414.0, 414.0, 0.04000580084112196, 0.010704677178190838, 0.02281580829220237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 252.87499999999997, 141, 430, 151.5, 430.0, 430.0, 430.0, 0.039948665964235956, 0.010767413873172973, 0.023485446201630903], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 181.75, 143, 425, 148.0, 425.0, 425.0, 425.0, 0.04000540072909843, 0.01078270566526481, 0.02355786781215464], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 152.5, 150, 155, 152.5, 155.0, 155.0, 155.0, 0.16473107651758503, 0.04858279795733465, 0.10183083148010873], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1698.925925925926, 1150, 2709, 1617.0, 2393.5, 2541.0, 2709.0, 0.24639870047500195, 294.77850781631435, 0.48654118394575574], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=65a1ee2c-e41c-43da-84b9-e8227f871cc0", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 1101.7083333333333, 195, 2010, 1115.0, 1875.5, 1978.75, 2010.0, 0.09910270756855635, 0.03125993607875362, 0.044712354391282266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 202.2, 142, 428, 147.0, 428.0, 428.0, 428.0, 0.04180567052114949, 0.011267934632653574, 0.02461798762134096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 145.2, 138, 149, 146.0, 149.0, 149.0, 149.0, 0.0418049714472045, 0.01126774621037934, 0.02457675079220421], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 23, 0, 0.0, 315.17391304347825, 141, 1550, 150.0, 1067.0000000000014, 1536.6, 1550.0, 0.10496914819818176, 8.238999561297419, 0.06092596195096572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 23, 0, 0.0, 281.8695652173913, 138, 1141, 149.0, 858.600000000001, 1139.8, 1141.0, 0.1048313582497721, 2.706137477210574, 0.06094836058568824], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c282a8f-a906-4747-a1b1-dcfd215e427d", 2, 0, 0.0, 362.5, 289, 436, 362.5, 436.0, 436.0, 436.0, 0.011347582113941072, 0.022440286895244795, 0.00705345314015966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 23, 0, 0.0, 170.91304347826087, 140, 429, 148.0, 306.00000000000034, 424.79999999999995, 429.0, 0.10496579484207212, 0.07800680651837585, 0.05268790873908698], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 207.0, 145, 446, 149.0, 446.0, 446.0, 446.0, 0.0418049714472045, 0.011186095875521518, 0.02384189777848382], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 23, 0, 0.0, 221.65217391304347, 136, 444, 147.0, 443.2, 444.0, 444.0, 0.10482992484150172, 0.04174146718595462, 0.05902024470950717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 208.2, 145, 446, 150.0, 446.0, 446.0, 446.0, 0.04170141784820684, 0.0309909951000834, 0.020932157005838198], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 541.8571428571429, 150, 892, 536.5, 853.5, 892.0, 892.0, 0.07752538956508256, 0.01496862990486527, 0.0527579311242289], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ce3dcd19-b1fc-42f9-936e-98818f49b322", 3, 0, 0.0, 374.0, 271, 576, 275.0, 576.0, 576.0, 576.0, 0.0423005879781729, 0.027690912247430238, 0.0271263536188153], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 150.2, 146, 153, 151.0, 153.0, 153.0, 153.0, 0.039365429280006296, 0.030984898437192456, 0.013993179939377239], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1378.863636363636, 871, 2206, 1346.5, 1892.1, 2163.0999999999995, 2206.0, 0.09789873710629134, 0.05067024479134219, 0.04502959489947579], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 416.4, 291, 893, 299.0, 893.0, 893.0, 893.0, 0.04164931278633902, 0.06454830018742191, 0.0936702806122449], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3265cb48-7def-43a4-95ea-54c207da318b", 1, 0, 0.0, 781.0, 781, 781, 781.0, 781.0, 781.0, 781.0, 1.2804097311139564, 0.23132402368758, 0.882782490396927], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/27ddabe9-135e-4330-ad54-89024b56704f", 3, 0, 0.0, 365.3333333333333, 235, 453, 408.0, 453.0, 453.0, 453.0, 0.09314456035767511, 0.042145487922255344, 0.05973137496895182], "isController": false}, {"data": ["addBook", 59, 10, 16.949152542372882, 1443.2542372881358, 754, 3025, 1166.0, 2568.0, 2816.0, 3025.0, 0.2883055452395379, 100.49821370434755, 1.0455132220465784], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e8fac17f-3cbe-4aae-8c88-77b57b38606e", 3, 0, 0.0, 450.0, 326, 664, 360.0, 664.0, 664.0, 664.0, 0.04986453468078387, 0.03101924667154231, 0.031976931419643306], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 252.87037037037038, 144, 618, 150.0, 591.5, 603.5, 618.0, 0.24780076818238136, 0.18415662557303927, 0.11978650415066287], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 923.7777777777777, 693, 1432, 871.5, 1236.5, 1308.0, 1432.0, 0.24753382962338186, 72.78316480596098, 0.12449211157816568], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=496e296b-2aa6-4c66-9ed5-47dd7d22200c", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 199.3703703703704, 138, 599, 148.5, 443.5, 447.0, 599.0, 0.24833409213194818, 0.4394349364678614, 0.1207718534001076], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1442.277777777778, 999, 2109, 1463.5, 1782.5, 1938.0, 2109.0, 0.247098876157704, 222.3400031201953, 0.12403205307134751], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 152.94117647058823, 144, 176, 151.0, 170.4, 176.0, 176.0, 0.10183665400697281, 0.07607914093294356, 0.03619974810404112], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/496e296b-2aa6-4c66-9ed5-47dd7d22200c", 3, 0, 0.0, 307.6666666666667, 244, 425, 254.0, 425.0, 425.0, 425.0, 0.026912346487490246, 0.026991191252590314, 0.017258243027459565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 10, 5.813953488372093, 203.68604651162778, 138, 913, 153.0, 341.9000000000003, 420.35, 643.6300000000037, 0.7527714682107235, 1.6102047035087028, 0.3627687629382596], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 188.5, 145, 440, 151.0, 440.0, 440.0, 440.0, 0.04155671452614956, 0.03218210412034824, 0.014772113366717226], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70145975-8e58-4b22-88da-e1c3f45999c1", 3, 0, 0.0, 382.6666666666667, 237, 517, 394.0, 517.0, 517.0, 517.0, 0.026817080692595804, 0.026895646358687395, 0.01719715135560343], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8f53d441-0264-4fc1-9ace-71334cd463fc", 1, 0, 0.0, 608.0, 608, 608, 608.0, 608.0, 608.0, 608.0, 1.644736842105263, 0.2971448396381579, 1.1339689555921053], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/659f5c20-581a-48d6-8cc8-06fda4d1051a", 1, 0, 0.0, 357.0, 357, 357, 357.0, 357.0, 357.0, 357.0, 2.8011204481792715, 0.8944984243697479, 1.671371673669468], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 12, 0, 0.0, 149.33333333333334, 141, 158, 150.0, 156.20000000000002, 158.0, 158.0, 0.12289541600098315, 0.09973251044611035, 0.04368547990659948], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bab4427c-700b-4010-b03b-6632606413cf", 1, 0, 0.0, 755.0, 755, 755, 755.0, 755.0, 755.0, 755.0, 1.3245033112582782, 0.23929014900662252, 0.9131829470198676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 401.625, 291, 579, 303.0, 579.0, 579.0, 579.0, 0.03991816775609999, 0.06186536350481513, 0.08977689486552567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c282a8f-a906-4747-a1b1-dcfd215e427d", 1, 0, 0.0, 585.0, 585, 585, 585.0, 585.0, 585.0, 585.0, 1.7094017094017093, 0.3088274572649573, 1.1785523504273505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 23, 0, 0.0, 528.3913043478261, 288, 1694, 301.0, 1329.2000000000012, 1681.9999999999998, 1694.0, 0.10475878151872904, 11.046318006383453, 0.23327421436607274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6eb1bfc0-7b9f-4b6c-93b9-84562a6ada2c", 1, 0, 0.0, 655.0, 655, 655, 655.0, 655.0, 655.0, 655.0, 1.5267175572519083, 0.2758229961832061, 1.0526001908396947], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 172.86666666666667, 145, 449, 152.0, 281.0000000000001, 449.0, 449.0, 0.08864933867593347, 0.07349930521080814, 0.03151206960746073], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 151.68750000000003, 141, 169, 151.0, 165.5, 169.0, 169.0, 0.08362340200905223, 0.06492246542694972, 0.029725506182905287], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b7c990e3-75db-4379-b54e-ad5c93710fd6", 3, 0, 0.0, 530.3333333333334, 320, 764, 507.0, 764.0, 764.0, 764.0, 0.0860560511746651, 0.03893812211353662, 0.05518568385875334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 163.9411764705882, 141, 428, 147.0, 209.5999999999998, 428.0, 428.0, 0.09776351580606019, 0.07265433157071464, 0.0490727022698388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 248.99999999999997, 142, 443, 149.0, 440.6, 443.0, 443.0, 0.097757331799885, 0.04343148001725129, 0.05478633553766532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 378.88235294117646, 137, 1825, 151.0, 1377.7999999999995, 1825.0, 1825.0, 0.0977584561064532, 10.3718644514313, 0.056482913115734515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 342.88235294117646, 139, 1326, 151.0, 1169.9999999999998, 1326.0, 1326.0, 0.09775620751917746, 3.404845113914734, 0.05657707897263977], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 25.0, 0.46547711404189296], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.333333333333334, 0.1551590380139643], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.333333333333334, 0.1551590380139643], "isController": false}, {"data": ["401/Unauthorized", 14, 58.333333333333336, 1.0861132660977502], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1289, 24, "401/Unauthorized", 14, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
