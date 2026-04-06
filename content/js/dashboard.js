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

    var data = {"OkPercent": 97.85344189489267, "KoPercent": 2.146558105107328};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7860759493670886, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.16379310344827586, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/65f2ab0b-5410-41eb-8a2c-95625c1d6f80"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f68188b0-eb8e-4419-8c08-30a8c3c8b060"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9e7d5b09-02e2-4be6-82e1-e6aede1cc570"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2e8622f7-97fe-40fa-9ac7-4e9463b18322"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/49acf637-1d34-49f4-9dfe-ea68e2f8b8cc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/52c5b13a-28f8-44f2-a027-10143cfa4790"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3c110f37-d6bc-4746-a7ca-e3580a5ba52a"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c4b9be14-e820-4665-b06b-1d4156379607"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/41443c6b-cf97-4d71-91fb-67e7c2eee5ff"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.06818181818181818, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7480901c-1a81-4cae-bd72-9cbaed6ecd0c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7c15f0d2-8ea8-4b06-a0be-5100038f353c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a24155d8-07af-46d2-a6b6-51d4d68f29f2"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5338daec-2cf2-46ea-889c-2a0a52699d7f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=040287f9-cd85-45b3-8ae3-3312c5fc3ec7"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bfbff8e6-ea2e-4b65-a3a3-27c0ce344e16"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e97432a5-f6e1-43d1-858a-c78874b3f620"], "isController": false}, {"data": [0.3125, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c4b9be14-e820-4665-b06b-1d4156379607"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f68188b0-eb8e-4419-8c08-30a8c3c8b060"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.39655172413793105, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/591ab2a5-6458-442b-81a5-10a9add0ef26"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.45454545454545453, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9e7d5b09-02e2-4be6-82e1-e6aede1cc570"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.25833333333333336, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=52c5b13a-28f8-44f2-a027-10143cfa4790"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2e8622f7-97fe-40fa-9ac7-4e9463b18322"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=41443c6b-cf97-4d71-91fb-67e7c2eee5ff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=49acf637-1d34-49f4-9dfe-ea68e2f8b8cc"], "isController": false}, {"data": [0.9827586206896551, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5603448275862069, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9157303370786517, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3c110f37-d6bc-4746-a7ca-e3580a5ba52a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/040287f9-cd85-45b3-8ae3-3312c5fc3ec7"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7c15f0d2-8ea8-4b06-a0be-5100038f353c"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a24155d8-07af-46d2-a6b6-51d4d68f29f2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7480901c-1a81-4cae-bd72-9cbaed6ecd0c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5338daec-2cf2-46ea-889c-2a0a52699d7f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1351, 29, 2.146558105107328, 350.90229459659537, 97, 4476, 112.0, 984.1999999999998, 1200.5999999999995, 1529.2000000000003, 5.36942092921585, 754.7192525448611, 3.918316820923254], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1699.8103448275865, 1201, 4927, 1637.0, 2011.9, 2069.8499999999995, 4927.0, 0.25569471814065853, 307.68678113413836, 1.2572489314826325], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/65f2ab0b-5410-41eb-8a2c-95625c1d6f80", 2, 0, 0.0, 208.5, 186, 231, 208.5, 231.0, 231.0, 231.0, 0.02281386170237036, 0.02575471106244154, 0.014180686497615952], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f68188b0-eb8e-4419-8c08-30a8c3c8b060", 3, 0, 0.0, 294.3333333333333, 205, 391, 287.0, 391.0, 391.0, 391.0, 0.02147289762438176, 0.02958814311328385, 0.013770054791677104], "isController": false}, {"data": ["deleteBook", 17, 2, 11.764705882352942, 454.6470588235294, 104, 955, 430.0, 791.7999999999998, 955.0, 955.0, 0.08742922090278385, 0.016970550174087006, 0.058932357426083735], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 2, 11.764705882352942, 454.6470588235294, 104, 955, 430.0, 791.7999999999998, 955.0, 955.0, 0.08659772808313382, 0.016809152297386786, 0.058371883118537006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 152.1, 99, 308, 102.5, 302.9, 307.75, 308.0, 0.11047160327437833, 0.04615210144607328, 0.06207554738679422], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 113.2, 99, 305, 103.0, 112.30000000000001, 295.39999999999986, 305.0, 0.11047099307899227, 0.08209807200499329, 0.05545126019785355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9e7d5b09-02e2-4be6-82e1-e6aede1cc570", 3, 0, 0.0, 712.3333333333334, 367, 909, 861.0, 909.0, 909.0, 909.0, 0.02993623581770828, 0.024956608049853814, 0.019197390807579855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 191.55, 100, 792, 103.5, 742.2000000000011, 791.95, 792.0, 0.11046977270844266, 3.2749756621282002, 0.0641026747493717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 227.4, 98, 992, 103.0, 852.2000000000013, 988.05, 992.0, 0.11047404412333323, 9.967272495967697, 0.06399726852925905], "isController": false}, {"data": ["goToProfile", 18, 3, 16.666666666666668, 286.0555555555555, 98, 1563, 202.0, 486.6000000000017, 1563.0, 1563.0, 0.09040637666310064, 0.14425192804154674, 0.05843159533352419], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2e8622f7-97fe-40fa-9ac7-4e9463b18322", 1, 0, 0.0, 600.0, 600, 600, 600.0, 600.0, 600.0, 600.0, 1.6666666666666667, 0.30110677083333337, 1.1490885416666667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 103.47058823529412, 101, 108, 103.0, 108.0, 108.0, 108.0, 0.09115477007549759, 0.06774294924556022, 0.0457554216980525], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/49acf637-1d34-49f4-9dfe-ea68e2f8b8cc", 3, 0, 0.0, 275.0, 192, 434, 199.0, 434.0, 434.0, 434.0, 0.0581181347953273, 0.026296942501791976, 0.03726976743059726], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 782.8, 706, 806, 801.0, 806.0, 806.0, 806.0, 0.02315597400973477, 6.808625209561565, 0.013206141427426862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 126.47058823529409, 98, 321, 102.0, 304.2, 321.0, 321.0, 0.09115477007549759, 0.0404981038467313, 0.05108604876243994], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1069.2, 889, 1272, 1071.0, 1272.0, 1272.0, 1272.0, 0.023127590290112493, 20.810246397010527, 0.013167368299937093], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 223.0, 100, 309, 295.0, 309.0, 309.0, 309.0, 0.023231609857636695, 0.041109059630896186, 0.012863596473906256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/52c5b13a-28f8-44f2-a027-10143cfa4790", 3, 0, 0.0, 278.0, 198, 420, 216.0, 420.0, 420.0, 420.0, 0.06544930950978467, 0.029614108144075744, 0.041971074132251235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 123.9, 101, 299, 104.0, 280.1000000000001, 299.0, 299.0, 0.04832411953454208, 0.0359127489900259, 0.024256442813236943], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 162.70000000000002, 100, 305, 103.5, 304.9, 305.0, 305.0, 0.04832435305772344, 0.012930539783023654, 0.027559982603232898], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 181.3, 100, 302, 105.5, 302.0, 302.0, 302.0, 0.04832411953454208, 0.013024860343294545, 0.02840929683573665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 140.9, 98, 300, 103.0, 299.4, 300.0, 300.0, 0.04832435305772344, 0.01302492328508952, 0.02845662587285863], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 103.8, 101, 107, 103.0, 107.0, 107.0, 107.0, 0.023231286037532464, 0.017264656908752153, 0.013044911593340983], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3c110f37-d6bc-4746-a7ca-e3580a5ba52a", 3, 0, 0.0, 322.0, 259, 409, 298.0, 409.0, 409.0, 409.0, 0.04968779502128294, 0.03194446457260215, 0.03186359251039303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 849.7692307692307, 99, 1279, 1108.0, 1251.0, 1279.0, 1279.0, 0.06614362324592199, 41.20897286744054, 0.03494998842486593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 259.94117647058823, 99, 1203, 103.0, 1099.8, 1203.0, 1203.0, 0.09105565643093963, 9.660718506124832, 0.05261016730137815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 566.9230769230769, 103, 907, 606.0, 868.5999999999999, 907.0, 907.0, 0.06621201085876978, 13.483703966736105, 0.0350507842940017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 184.0, 100, 603, 103.0, 597.4, 603.0, 603.0, 0.09115477007549759, 3.1749172904512695, 0.05275645154587766], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 409.86666666666673, 105, 642, 467.0, 639.0, 642.0, 642.0, 0.07841743167227787, 0.015361852337362248, 0.053319769295916024], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 328.0, 207, 602, 307.0, 583.1000000000001, 602.0, 602.0, 0.048299845440494586, 0.07485532686920403, 0.10862748442329985], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c4b9be14-e820-4665-b06b-1d4156379607", 3, 0, 0.0, 282.3333333333333, 195, 444, 208.0, 444.0, 444.0, 444.0, 0.1003814495081309, 0.045419991802181627, 0.06437221859733655], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41443c6b-cf97-4d71-91fb-67e7c2eee5ff", 3, 0, 0.0, 317.0, 195, 536, 220.0, 536.0, 536.0, 536.0, 0.037577503601177425, 0.03132681859460137, 0.024097552765077974], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 463.2727272727273, 120, 950, 435.0, 817.9, 933.6499999999997, 950.0, 0.09454436064376115, 0.058074612153247815, 0.0427480849395131], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 133.07692307692307, 98, 307, 103.0, 303.8, 307.0, 307.0, 0.06621268533185289, 0.04920688822025395, 0.03323566431696522], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 193.76923076923075, 100, 307, 106.0, 305.0, 307.0, 307.0, 0.06614564252859527, 0.08647827242846094, 0.03387777875300199], "isController": false}, {"data": ["login", 22, 0, 0.0, 2235.0, 1199, 3673, 2025.0, 3360.8999999999996, 3649.45, 3673.0, 0.09517670420378198, 26.009489043052316, 0.17947027674789853], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7480901c-1a81-4cae-bd72-9cbaed6ecd0c", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.45279213659147866, 1.727952694235589], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 119.52941176470587, 102, 300, 107.0, 156.79999999999987, 300.0, 300.0, 0.09282009282009282, 0.07514439155064155, 0.03299464236964237], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7c15f0d2-8ea8-4b06-a0be-5100038f353c", 3, 0, 0.0, 641.0, 264, 1335, 324.0, 1335.0, 1335.0, 1335.0, 0.0392695857058708, 0.025246559820668892, 0.025182644479350744], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a24155d8-07af-46d2-a6b6-51d4d68f29f2", 3, 0, 0.0, 760.0, 318, 1563, 399.0, 1563.0, 1563.0, 1563.0, 0.02603082049146189, 0.02610708266087047, 0.016692941526100236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 984.6153846153846, 204, 1385, 1207.0, 1356.2, 1385.0, 1385.0, 0.06610897810775763, 54.78567024333189, 0.13697053224084008], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5338daec-2cf2-46ea-889c-2a0a52699d7f", 3, 0, 0.0, 295.0, 193, 422, 270.0, 422.0, 422.0, 422.0, 0.035306578792515, 0.03520314154995881, 0.022641263092856304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=040287f9-cd85-45b3-8ae3-3312c5fc3ec7", 1, 0, 0.0, 642.0, 642, 642, 642.0, 642.0, 642.0, 642.0, 1.557632398753894, 0.2814081970404984, 1.0739145249221183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 5, 50.0, 638.3000000000001, 98, 1379, 549.0, 1362.6000000000001, 1379.0, 1379.0, 0.045633969927213816, 27.303151809957335, 0.06649012024551076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 362.54999999999995, 203, 1093, 210.5, 978.2000000000008, 1089.3, 1093.0, 0.11040696005476186, 13.362509091323117, 0.24548297524675955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bfbff8e6-ea2e-4b65-a3a3-27c0ce344e16", 2, 0, 0.0, 226.0, 207, 245, 226.0, 245.0, 245.0, 245.0, 0.015854267572473824, 0.022573752070963703, 0.009854727841679284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e97432a5-f6e1-43d1-858a-c78874b3f620", 1, 0, 0.0, 316.0, 316, 316, 316.0, 316.0, 316.0, 316.0, 3.1645569620253164, 1.0105567642405062, 1.8882268591772151], "isController": false}, {"data": ["register", 24, 6, 25.0, 1014.1666666666666, 296, 2132, 1035.5, 1687.0, 2063.0, 2132.0, 0.10120731897595062, 0.03192379299729692, 0.04566189586610272], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c4b9be14-e820-4665-b06b-1d4156379607", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 187.0, 5.347593582887701, 0.9661179812834224, 3.6869151069518717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 399.94117647058823, 204, 1305, 217.0, 1205.0, 1305.0, 1305.0, 0.09100593679905353, 12.933241164728777, 0.20193510574086865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 21, 0, 0.0, 106.23809523809524, 102, 114, 105.0, 112.2, 113.9, 114.0, 0.12870801667075266, 0.09992468091137534, 0.0457516778009316], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f68188b0-eb8e-4419-8c08-30a8c3c8b060", 1, 0, 0.0, 637.0, 637, 637, 637.0, 637.0, 637.0, 637.0, 1.5698587127158556, 0.28361705259026687, 1.082343995290424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 396.6470588235294, 201, 1211, 210.0, 1211.0, 1211.0, 1211.0, 0.08163892543964962, 11.602055297465832, 0.18115043502742106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 141.28571428571428, 103, 368, 104.0, 368.0, 368.0, 368.0, 0.0393572400454295, 0.02924888640094907, 0.019755489632178477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 131.0, 100, 304, 103.0, 304.0, 304.0, 304.0, 0.03935768261964735, 0.010531254919710327, 0.022446178369017633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 130.71428571428572, 100, 304, 103.0, 304.0, 304.0, 304.0, 0.03935834649963734, 0.010608304329980377, 0.023138402922638357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 129.42857142857142, 100, 298, 102.0, 298.0, 298.0, 298.0, 0.03935790391048888, 0.010608185038373958, 0.02317657818166484], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 105.5, 105, 106, 105.5, 106.0, 106.0, 106.0, 0.027802104619319683, 0.008199448823275923, 0.01718626193752867], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1186.8965517241377, 789, 4476, 1006.5, 1588.7, 1632.8999999999994, 4476.0, 0.24952353910421052, 298.51690118652743, 0.49271151959835313], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 1014.1666666666666, 296, 2132, 1035.5, 1687.0, 2063.0, 2132.0, 0.10444227823422922, 0.032944195185210974, 0.047121418500208886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 13, 0, 0.0, 147.0, 99, 302, 102.0, 300.8, 302.0, 302.0, 0.07654668464532388, 0.020631723595809955, 0.045075830899541314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 13, 0, 0.0, 116.61538461538463, 99, 301, 101.0, 222.99999999999994, 301.0, 301.0, 0.07663467660166473, 0.02065544017779245, 0.045052807924025565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/591ab2a5-6458-442b-81a5-10a9add0ef26", 1, 0, 0.0, 550.0, 550, 550, 550.0, 550.0, 550.0, 550.0, 1.8181818181818181, 0.5806107954545454, 1.084872159090909], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 21, 0, 0.0, 172.33333333333331, 100, 975, 103.0, 302.6, 907.799999999999, 975.0, 0.128376767472995, 5.533603430792696, 0.07494614671019251], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 21, 0, 0.0, 173.52380952380952, 100, 783, 103.0, 306.8, 735.3999999999993, 783.0, 0.128376767472995, 1.830431579003674, 0.07507151464717786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 21, 0, 0.0, 122.42857142857142, 100, 307, 103.0, 259.0000000000001, 305.9, 307.0, 0.12837912188680628, 0.09540674976158163, 0.06444030141583831], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 13, 0, 0.0, 102.61538461538461, 100, 111, 101.0, 109.8, 111.0, 111.0, 0.07663377309329278, 0.02050552131597873, 0.04370519871726854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 21, 0, 0.0, 130.85714285714286, 99, 304, 102.0, 299.4, 303.6, 304.0, 0.12837598268758177, 0.04353225752222127, 0.07270101921360542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 13, 0, 0.0, 119.23076923076924, 100, 311, 103.0, 229.79999999999993, 311.0, 311.0, 0.07663241787067986, 0.05695045898397204, 0.0384658816264936], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 484.6, 103, 1335, 434.0, 1050.6000000000001, 1335.0, 1335.0, 0.07987305509110852, 0.015355802844013248, 0.054356318025218585], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 13, 0, 0.0, 154.2307692307692, 102, 339, 107.0, 324.59999999999997, 339.0, 339.0, 0.08063415662874794, 0.0634679006277059, 0.02866292286412524], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1266.9545454545453, 805, 2828, 1147.5, 1678.8999999999999, 2667.649999999998, 2828.0, 0.0955449973507978, 0.04945200058195589, 0.04394696655490797], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9e7d5b09-02e2-4be6-82e1-e6aede1cc570", 1, 0, 0.0, 559.0, 559, 559, 559.0, 559.0, 559.0, 559.0, 1.7889087656529516, 0.3231915250447227, 1.2333687388193202], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 13, 0, 0.0, 268.53846153846155, 204, 614, 208.0, 529.5999999999999, 614.0, 614.0, 0.07649938800489596, 0.11855911012086903, 0.17204891657741736], "isController": false}, {"data": ["addBook", 60, 14, 23.333333333333332, 1020.6666666666664, 514, 1941, 837.0, 1789.5, 1867.6, 1941.0, 0.2933354192740926, 94.71981635827743, 1.0647922940785357], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=52c5b13a-28f8-44f2-a027-10143cfa4790", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 0.6522168321299638, 2.4890004512635375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e8622f7-97fe-40fa-9ac7-4e9463b18322", 3, 0, 0.0, 288.6666666666667, 195, 445, 226.0, 445.0, 445.0, 445.0, 0.03135418735172082, 0.026138695900962575, 0.020106689154586594], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=41443c6b-cf97-4d71-91fb-67e7c2eee5ff", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=49acf637-1d34-49f4-9dfe-ea68e2f8b8cc", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 0.72265625, 2.7578125], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 234.44827586206895, 100, 3214, 104.0, 410.3, 416.19999999999993, 3214.0, 0.25031073056207703, 0.1860219394118561, 0.12099981604319156], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 642.4827586206897, 491, 970, 603.0, 808.2, 899.5999999999999, 970.0, 0.25331935709294195, 74.48430197960342, 0.12740182510045422], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 153.89655172413785, 99, 402, 105.0, 306.1, 308.2, 402.0, 0.2537526961223963, 0.4490233255603341, 0.12340707291889977], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 949.4137931034484, 687, 1393, 903.5, 1214.0, 1295.7999999999997, 1393.0, 0.25306845501708214, 227.71144067126406, 0.1270285018347463], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 119.23529411764706, 103, 309, 106.0, 160.19999999999987, 309.0, 309.0, 0.08150701679524, 0.06089147250816269, 0.028973197376432967], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 14, 7.865168539325842, 155.87078651685403, 101, 756, 107.5, 285.5, 321.8499999999997, 637.5000000000011, 0.755883576943003, 1.643600561710675, 0.3618845706326491], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 110.0, 104, 130, 106.0, 130.0, 130.0, 130.0, 0.03811618903451693, 0.02951771279723821, 0.013549114070863441], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 118.05000000000001, 103, 313, 106.0, 133.70000000000005, 304.14999999999986, 313.0, 0.11007457552491813, 0.08932809791133493, 0.03912807176862324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3c110f37-d6bc-4746-a7ca-e3580a5ba52a", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 0.36205222945891785, 1.3816695891783568], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/040287f9-cd85-45b3-8ae3-3312c5fc3ec7", 3, 0, 0.0, 333.6666666666667, 190, 498, 313.0, 498.0, 498.0, 498.0, 0.0378067069098058, 0.024306069709266423, 0.02424453535557208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 301.0, 205, 672, 207.0, 672.0, 672.0, 672.0, 0.03933446092121307, 0.060960731915981586, 0.08846412451323604], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7c15f0d2-8ea8-4b06-a0be-5100038f353c", 1, 0, 0.0, 509.0, 509, 509, 509.0, 509.0, 509.0, 509.0, 1.9646365422396854, 0.35493921905697445, 1.3545248035363457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 21, 0, 0.0, 316.3333333333333, 200, 1272, 211.0, 569.2000000000002, 1205.699999999999, 1272.0, 0.1282952011485475, 7.498205394507743, 0.2869757938265571], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a24155d8-07af-46d2-a6b6-51d4d68f29f2", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.3868609475374732, 1.476345021413276], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 127.69999999999999, 103, 301, 107.5, 282.9000000000001, 301.0, 301.0, 0.04953756681379324, 0.04107167404776412, 0.017609056953340568], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 109.76923076923079, 102, 130, 107.0, 126.39999999999999, 130.0, 130.0, 0.06624912729515006, 0.05143364863246513, 0.02354949446819787], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7480901c-1a81-4cae-bd72-9cbaed6ecd0c", 3, 0, 0.0, 335.6666666666667, 199, 464, 344.0, 464.0, 464.0, 464.0, 0.03220923116565207, 0.026369211061723623, 0.020655008267035996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5338daec-2cf2-46ea-889c-2a0a52699d7f", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 115.88235294117649, 99, 314, 103.0, 152.39999999999986, 314.0, 314.0, 0.08175592489996923, 0.06075806528210603, 0.04103764199080486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 136.94117647058823, 97, 301, 102.0, 300.2, 301.0, 301.0, 0.08168128921903078, 0.03628924005169945, 0.045776807078404425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 243.82352941176472, 100, 1107, 103.0, 1107.0, 1107.0, 1107.0, 0.08175828403789737, 8.674296563146251, 0.047238328403789734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 219.35294117647058, 99, 804, 103.0, 800.8, 804.0, 804.0, 0.08168128921903078, 2.8449563005102676, 0.04727360919587173], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 20.689655172413794, 0.44411547002220575], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.344827586206897, 0.22205773501110287], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.896551724137931, 0.14803849000740193], "isController": false}, {"data": ["401/Unauthorized", 18, 62.06896551724138, 1.3323464100666174], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1351, 29, "401/Unauthorized", 18, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
