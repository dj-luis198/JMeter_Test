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

    var data = {"OkPercent": 98.98516783762686, "KoPercent": 1.014832162373146};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7280701754385965, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1b53f6d7-785f-4102-8b95-55e4db8d59a1"], "isController": false}, {"data": [0.45454545454545453, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.45454545454545453, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b48d3806-0968-49a0-8eb3-432caa43e122"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/35c67d64-7dc4-47c5-b095-6e4e80d44817"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/172fd731-af9e-4432-bd26-67a157ad5838"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5ff7b966-b6aa-4717-ab03-8920280d7ac3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.72, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.82, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5edc7846-bf9a-4ab2-b832-dbf86f0b8881"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5edc7846-bf9a-4ab2-b832-dbf86f0b8881"], "isController": false}, {"data": [0.55, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5ff7b966-b6aa-4717-ab03-8920280d7ac3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d66fb36b-29b4-4848-8ff9-49c2d93a4bf9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2399bc5b-cca9-4b59-91c2-7725eac3b11a"], "isController": false}, {"data": [0.6190476190476191, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.98, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.96, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/076a48ff-9eed-4f69-9892-244c24e401bd"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=35c67d64-7dc4-47c5-b095-6e4e80d44817"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bf073eed-588e-418e-befe-ce1f6aab8dd6"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9fd55d36-8dcd-4ef1-8aaf-99b7e3ae36d4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a374d602-f520-4da1-90ef-5ba63f2ff08e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/71d243a4-c4fb-4ea8-a055-39f8cab94393"], "isController": false}, {"data": [0.58, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6ff5ed5d-0461-4c9b-aa0a-313ebf6b7211"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=71d243a4-c4fb-4ea8-a055-39f8cab94393"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b48d3806-0968-49a0-8eb3-432caa43e122"], "isController": false}, {"data": [0.26785714285714285, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5454545454545454, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.19047619047619047, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9f9bd287-644b-4aa3-93c6-0859f8aa8c91"], "isController": false}, {"data": [0.31896551724137934, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d66fb36b-29b4-4848-8ff9-49c2d93a4bf9"], "isController": false}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9821428571428571, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.36607142857142855, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9593023255813954, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a511183b-9397-4abd-8e51-d49ab79ca1e8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fa1fa3a3-5fe4-45de-895a-c6750a91099a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9fd55d36-8dcd-4ef1-8aaf-99b7e3ae36d4"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a374d602-f520-4da1-90ef-5ba63f2ff08e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bf073eed-588e-418e-befe-ce1f6aab8dd6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6ff5ed5d-0461-4c9b-aa0a-313ebf6b7211"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1281, 13, 1.014832162373146, 504.6081186572993, 1, 3418, 169.0, 1389.6, 1671.0, 2170.6000000000013, 5.050266114725014, 729.6468897841514, 3.6835059691011236], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 1, 1.7857142857142858, 2343.8750000000005, 1705, 3098, 2347.0, 2761.0, 2984.5499999999997, 3098.0, 0.25436508657497414, 306.09286444186165, 1.2480408068596813], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1b53f6d7-785f-4102-8b95-55e4db8d59a1", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 1.2621973814229248, 2.3584177371541504], "isController": false}, {"data": ["deleteBook", 11, 1, 9.090909090909092, 743.4545454545455, 159, 1295, 759.0, 1260.4, 1295.0, 1295.0, 0.09304607472445674, 0.017776558310283283, 0.06283749027245582], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 1, 9.090909090909092, 743.4545454545455, 159, 1295, 759.0, 1260.4, 1295.0, 1295.0, 0.09063643255001483, 0.017316193434626412, 0.06121016889275238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 212.05882352941174, 139, 445, 147.0, 445.0, 445.0, 445.0, 0.08722779795989573, 0.0310468426102662, 0.049316175753750795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 196.88235294117644, 142, 427, 149.0, 425.4, 427.0, 427.0, 0.08722824553211796, 0.06482489731439625, 0.043784490433113894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 267.6470588235294, 133, 1112, 142.0, 576.7999999999995, 1112.0, 1112.0, 0.08722958827634333, 1.5308572263299947, 0.05092568391845573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 286.0588235294117, 137, 1392, 144.0, 633.5999999999993, 1392.0, 1392.0, 0.08722645527078683, 4.6389812863978035, 0.05083867274686369], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b48d3806-0968-49a0-8eb3-432caa43e122", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["goToProfile", 12, 1, 8.333333333333334, 332.6666666666667, 140, 514, 311.5, 511.90000000000003, 514.0, 514.0, 0.0699039985087147, 0.1725356747046556, 0.04518615398394538], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/35c67d64-7dc4-47c5-b095-6e4e80d44817", 3, 0, 0.0, 980.3333333333334, 514, 1895, 532.0, 1895.0, 1895.0, 1895.0, 0.01926448207439943, 0.022769965628953233, 0.012353850809429322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 144.86666666666665, 141, 155, 143.0, 153.8, 155.0, 155.0, 0.08455515532782035, 0.06283835273874148, 0.042442724451659815], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 972.75, 803, 1118, 985.0, 1118.0, 1118.0, 1118.0, 0.020234927508372202, 5.949740550288854, 0.01154023209461852], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 143.20000000000002, 136, 150, 141.0, 150.0, 150.0, 150.0, 0.08455610861514005, 0.022625365000535524, 0.048223405694572063], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1447.0, 1250, 1620, 1459.0, 1620.0, 1620.0, 1620.0, 0.020208143881984438, 18.183323387137516, 0.011505222542184501], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 422.5, 403, 445, 421.0, 445.0, 445.0, 445.0, 0.020308073474609833, 0.035935770640618175, 0.011244802402445091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 171.8, 137, 428, 143.5, 400.30000000000007, 428.0, 428.0, 0.07700363457155178, 0.05722633389545986, 0.03865221500954845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 228.4, 138, 444, 142.5, 442.4, 444.0, 444.0, 0.0770065994655742, 0.043737342040212845, 0.04262435603231197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 581.5, 141, 1619, 144.5, 1610.1000000000001, 1619.0, 1619.0, 0.0761898956960328, 20.581115512929426, 0.04282705465101218], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/172fd731-af9e-4432-bd26-67a157ad5838", 1, 0, 0.0, 665.0, 665, 665, 665.0, 665.0, 665.0, 665.0, 1.5037593984962407, 0.48020441729323304, 0.8972626879699248], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 352.8, 135, 1115, 142.5, 1102.5, 1115.0, 1115.0, 0.07643214736118012, 4.511198503840715, 0.04369470611839339], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ff7b966-b6aa-4717-ab03-8920280d7ac3", 3, 0, 0.0, 508.3333333333333, 262, 721, 542.0, 721.0, 721.0, 721.0, 0.02759381898454746, 0.02242896028789551, 0.017695255012877116], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 210.75, 138, 419, 143.0, 419.0, 419.0, 419.0, 0.02033543296678715, 0.015112562976293969, 0.011418822222561147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 25, 0, 0.0, 662.6, 137, 1813, 150.0, 1682.2, 1778.8, 1813.0, 0.12105775423338967, 39.234955282778806, 0.06742349452576835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 163.6, 136, 445, 144.0, 268.60000000000014, 445.0, 445.0, 0.08455563196879333, 0.02279038517908883, 0.049709463325403894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 25, 0, 0.0, 541.2399999999999, 135, 1333, 408.0, 1261.6000000000001, 1319.5, 1333.0, 0.12086286415980972, 12.814419075664988, 0.06743298003103758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 181.4, 136, 442, 142.0, 434.8, 442.0, 442.0, 0.08455515532782035, 0.022790256709451576, 0.0497917565065192], "isController": false}, {"data": ["deleteBooks", 11, 1, 9.090909090909092, 744.5454545454545, 146, 1565, 618.0, 1499.6000000000004, 1565.0, 1565.0, 0.09038545287220318, 0.01726824348197632, 0.061730760737380964], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5edc7846-bf9a-4ab2-b832-dbf86f0b8881", 1, 0, 0.0, 618.0, 618, 618, 618.0, 618.0, 618.0, 618.0, 1.6181229773462784, 0.2923366707119741, 1.1156199433656957], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5edc7846-bf9a-4ab2-b832-dbf86f0b8881", 3, 0, 0.0, 472.6666666666667, 271, 584, 563.0, 584.0, 584.0, 584.0, 0.026298718375791154, 0.02637576540228273, 0.01686473802093378], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 813.1, 281, 2047, 569.0, 2009.2000000000003, 2047.0, 2047.0, 0.07610697596541699, 25.150508977293484, 0.16661779171803887], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5ff7b966-b6aa-4717-ab03-8920280d7ac3", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.3635091800804829, 1.3872296277665996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d66fb36b-29b4-4848-8ff9-49c2d93a4bf9", 1, 0, 0.0, 1565.0, 1565, 1565, 1565.0, 1565.0, 1565.0, 1565.0, 0.6389776357827476, 0.11544029552715655, 0.4405451277955272], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2399bc5b-cca9-4b59-91c2-7725eac3b11a", 1, 0, 0.0, 369.0, 369, 369, 369.0, 369.0, 369.0, 369.0, 2.710027100271003, 0.8654090447154472, 1.617018123306233], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 893.5714285714284, 188, 2403, 703.0, 2129.4000000000005, 2384.7999999999997, 2403.0, 0.09416575863970834, 0.05784205291443023, 0.042576900634946256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 25, 0, 0.0, 187.51999999999995, 136, 612, 145.0, 430.00000000000006, 560.9999999999999, 612.0, 0.12105130638569851, 0.0899609806245279, 0.060762081525633824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 25, 0, 0.0, 277.72, 135, 561, 148.0, 483.80000000000024, 556.2, 561.0, 0.12088682575372936, 0.09771055462875655, 0.06528833019027586], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/076a48ff-9eed-4f69-9892-244c24e401bd", 1, 0, 0.0, 357.0, 357, 357, 357.0, 357.0, 357.0, 357.0, 2.8011204481792715, 0.8944984243697479, 1.671371673669468], "isController": false}, {"data": ["login", 21, 0, 0.0, 3559.2857142857147, 2104, 6545, 3614.0, 6071.200000000002, 6535.3, 6545.0, 0.0962905222614517, 22.076151545806777, 0.17569527631940943], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=35c67d64-7dc4-47c5-b095-6e4e80d44817", 1, 0, 0.0, 1238.0, 1238, 1238, 1238.0, 1238.0, 1238.0, 1238.0, 0.8077544426494346, 0.14593219911147012, 0.556908824717286], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 150.8, 144, 159, 150.0, 159.0, 159.0, 159.0, 0.08106443000897114, 0.06562735593499713, 0.028815871604751454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf073eed-588e-418e-befe-ce1f6aab8dd6", 3, 0, 0.0, 385.3333333333333, 283, 576, 297.0, 576.0, 576.0, 576.0, 0.03125455795636864, 0.026055638973391953, 0.020042799210301502], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9fd55d36-8dcd-4ef1-8aaf-99b7e3ae36d4", 3, 0, 0.0, 973.0, 359, 2069, 491.0, 2069.0, 2069.0, 2069.0, 0.018951238463433585, 0.026125812139531655, 0.012152975186511773], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a374d602-f520-4da1-90ef-5ba63f2ff08e", 1, 0, 0.0, 567.0, 567, 567, 567.0, 567.0, 567.0, 567.0, 1.763668430335097, 0.3186315035273369, 1.2159667107583776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/71d243a4-c4fb-4ea8-a055-39f8cab94393", 3, 0, 0.0, 408.3333333333333, 257, 535, 433.0, 535.0, 535.0, 535.0, 0.026790976799014092, 0.026869465988854955, 0.017180411554055263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 25, 0, 0.0, 896.8, 283, 1960, 610.0, 1827.8, 1925.1999999999998, 1960.0, 0.120775864151308, 52.13616648348994, 0.2605031597985459], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6ff5ed5d-0461-4c9b-aa0a-313ebf6b7211", 1, 0, 0.0, 631.0, 631, 631, 631.0, 631.0, 631.0, 631.0, 1.5847860538827259, 0.28631388668779717, 1.0926356973058637], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 1152.6666666666665, 140, 1797, 1535.5, 1797.0, 1797.0, 1797.0, 0.03029094452213511, 24.16170205448331, 0.05222525640022415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 552.8235294117648, 286, 1535, 551.0, 1004.5999999999996, 1535.0, 1535.0, 0.08716205476853348, 6.261027441947508, 0.1947176670435144], "isController": false}, {"data": ["register", 21, 4, 19.047619047619047, 1506.4761904761906, 782, 2307, 1412.0, 2101.0, 2286.4999999999995, 2307.0, 0.0939261114589856, 0.02982363695321585, 0.04237681981840952], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 152.0, 144, 170, 149.0, 168.4, 170.0, 170.0, 0.07034251393322873, 0.05461161970402034, 0.025004565499702397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 349.59999999999997, 283, 589, 293.0, 588.4, 589.0, 589.0, 0.08448752682478977, 0.13093916510834117, 0.19001442800536214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 462.2380952380953, 283, 1755, 301.0, 673.8000000000001, 1648.7999999999984, 1755.0, 0.11325333692867737, 6.6190845355264925, 0.2533295554132398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 210.66666666666666, 142, 528, 150.0, 528.0, 528.0, 528.0, 0.035394262590034156, 0.026303743975601555, 0.017766260714138237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 246.5, 142, 458, 146.0, 458.0, 458.0, 458.0, 0.03533131944812479, 0.0271425500968667, 0.01916080019549997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 600.3333333333334, 138, 1521, 146.0, 1521.0, 1521.0, 1521.0, 0.0353928011042554, 10.621861193120818, 0.019793239680049077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 422.0, 141, 1145, 146.0, 1145.0, 1145.0, 1145.0, 0.03539447138356989, 3.47540987535247, 0.019828738688516853], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 146.0, 146, 146, 146.0, 146.0, 146.0, 146.0, 6.8493150684931505, 2.0200128424657535, 4.234000428082192], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=71d243a4-c4fb-4ea8-a055-39f8cab94393", 1, 0, 0.0, 539.0, 539, 539, 539.0, 539.0, 539.0, 539.0, 1.8552875695732838, 0.3351837894248608, 1.2791338126159555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b48d3806-0968-49a0-8eb3-432caa43e122", 3, 0, 0.0, 520.0, 315, 792, 453.0, 792.0, 792.0, 792.0, 0.02021127519672308, 0.023889043046647625, 0.012961006555190257], "isController": false}, {"data": ["https://demoqa.com/books", 56, 1, 1.7857142857142858, 1582.6428571428573, 943, 2493, 1473.0, 2122.4, 2389.8, 2493.0, 0.2664066030779477, 314.44327598356364, 0.5236610540900549], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, 19.047619047619047, 1506.4761904761906, 782, 2307, 1412.0, 2101.0, 2286.4999999999995, 2307.0, 0.0962799270106458, 0.030571025931393676, 0.04343879519425621], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 264.57142857142856, 142, 429, 148.0, 429.0, 429.0, 429.0, 0.043980070745085226, 0.011854003443011251, 0.025898420565709367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 221.57142857142858, 136, 425, 143.0, 425.0, 425.0, 425.0, 0.04398172873326338, 0.011854450322637395, 0.025856445993578666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 375.6923076923077, 136, 1696, 143.0, 1665.2, 1696.0, 1696.0, 0.0672637619069794, 9.326732995850342, 0.03865443048290207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 337.15384615384613, 140, 1130, 146.0, 1118.8, 1130.0, 1130.0, 0.0672623698085092, 3.0580125004527274, 0.03871931639442654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 166.92307692307693, 142, 415, 146.0, 311.3999999999999, 415.0, 415.0, 0.0672637619069794, 0.04998801055782355, 0.03376325548846426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 303.0, 140, 428, 416.0, 428.0, 428.0, 428.0, 0.04390256140086801, 0.011747365062341638, 0.025038179548932542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 164.9230769230769, 137, 423, 144.0, 313.39999999999986, 423.0, 423.0, 0.0672634138769597, 0.033540755807937084, 0.03749207714596161], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 303.99999999999994, 146, 432, 406.0, 432.0, 432.0, 432.0, 0.0439792417978714, 0.03268379200017592, 0.02207551785557217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 187.42857142857142, 144, 424, 150.0, 424.0, 424.0, 424.0, 0.045276087111191604, 0.035637232628535576, 0.01609423409030639], "isController": false}, {"data": ["deleteAccount", 11, 1, 9.090909090909092, 563.7272727272727, 142, 903, 542.0, 880.8000000000001, 903.0, 903.0, 0.0877837009608325, 0.01655296349794107, 0.059743417219969994], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1835.1428571428569, 1169, 3418, 1612.0, 3096.6000000000004, 3394.4999999999995, 3418.0, 0.09501660528292326, 0.04917851640620051, 0.04370392684400083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 650.0, 295, 850, 835.0, 850.0, 850.0, 850.0, 0.043861023215013, 0.06797601937717347, 0.09864446920329584], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9f9bd287-644b-4aa3-93c6-0859f8aa8c91", 2, 0, 0.0, 387.5, 340, 435, 387.5, 435.0, 435.0, 435.0, 0.020779652564209126, 0.023925010130080623, 0.012916258649530379], "isController": false}, {"data": ["addBook", 58, 3, 5.172413793103448, 1538.0862068965512, 740, 4191, 1174.0, 2664.5, 3018.5999999999985, 4191.0, 0.2681944502244972, 95.0651697341407, 0.9735099096115343], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d66fb36b-29b4-4848-8ff9-49c2d93a4bf9", 3, 0, 0.0, 564.0, 282, 903, 507.0, 903.0, 903.0, 903.0, 0.022407959307145897, 0.026485449298257406, 0.014369687446314264], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 266.08928571428567, 138, 701, 150.0, 571.3, 577.15, 701.0, 0.2683997622744963, 0.19946505770594888, 0.12974402570886295], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 911.6071428571429, 665, 1295, 842.5, 1179.2, 1261.35, 1295.0, 0.26806443120078505, 78.81984334984801, 0.13481756061367609], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 222.89285714285703, 135, 572, 148.0, 444.3, 469.09999999999985, 572.0, 0.26896955840962145, 0.4759500389045254, 0.13080746102342916], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 1, 1.7857142857142858, 1298.3750000000005, 1, 1922, 1257.0, 1644.0000000000002, 1700.25, 1922.0, 0.2671730231581759, 236.11882766206907, 0.13171354221333767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 161.76190476190476, 142, 407, 150.0, 159.4, 382.2999999999996, 407.0, 0.11724245740190715, 0.0875883592895107, 0.04167602977958418], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 3, 1.744186046511628, 241.30232558139545, 137, 2193, 155.5, 422.0, 484.64999999999986, 1405.330000000011, 0.7329722450684178, 1.5859896696724212, 0.35260722515671544], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 149.83333333333331, 137, 159, 151.5, 159.0, 159.0, 159.0, 0.036010731197896974, 0.027887216640558887, 0.01280068960550244], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 153.23529411764707, 139, 179, 151.0, 175.0, 179.0, 179.0, 0.08281654187350504, 0.0672075647430495, 0.029438692619097494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 862.6666666666667, 285, 2037, 448.0, 2037.0, 2037.0, 2037.0, 0.03530180098021334, 14.11421621911828, 0.07638381221206969], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 610.9999999999999, 286, 2035, 298.0, 1956.6, 2035.0, 2035.0, 0.06721264011250362, 12.458861542284506, 0.14851711304907558], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a511183b-9397-4abd-8e51-d49ab79ca1e8", 1, 0, 0.0, 580.0, 580, 580, 580.0, 580.0, 580.0, 580.0, 1.7241379310344827, 0.550579202586207, 1.0287580818965518], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa1fa3a3-5fe4-45de-895a-c6750a91099a", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 1.0788376266891893, 2.0158097550675675], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9fd55d36-8dcd-4ef1-8aaf-99b7e3ae36d4", 1, 0, 0.0, 755.0, 755, 755, 755.0, 755.0, 755.0, 755.0, 1.3245033112582782, 0.23929014900662252, 0.9131829470198676], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a374d602-f520-4da1-90ef-5ba63f2ff08e", 3, 0, 0.0, 544.6666666666666, 346, 670, 618.0, 670.0, 670.0, 670.0, 0.028605209962241123, 0.02384698656031885, 0.018343835815629886], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 150.2, 144, 163, 147.0, 162.4, 163.0, 163.0, 0.07661250162801567, 0.06351954480682158, 0.027233350188083694], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bf073eed-588e-418e-befe-ce1f6aab8dd6", 1, 0, 0.0, 1172.0, 1172, 1172, 1172.0, 1172.0, 1172.0, 1172.0, 0.8532423208191127, 0.15415022397610922, 0.5882705844709898], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 25, 0, 0.0, 152.47999999999996, 141, 171, 153.0, 168.4, 170.4, 171.0, 0.12345130339886128, 0.09584354121298314, 0.043883080505063975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 145.04761904761907, 136, 159, 143.0, 151.8, 158.29999999999998, 159.0, 0.11358903487183371, 0.0844152886108061, 0.0570163710196509], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 224.6190476190476, 136, 444, 144.0, 442.0, 443.8, 444.0, 0.1134105244966733, 0.038457475103689624, 0.06422588203685302], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6ff5ed5d-0461-4c9b-aa0a-313ebf6b7211", 3, 0, 0.0, 451.3333333333333, 260, 608, 486.0, 608.0, 608.0, 608.0, 0.01893819834606401, 0.026107835285019886, 0.012144612871662143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 266.8571428571429, 134, 1611, 148.0, 425.4, 1492.4999999999984, 1611.0, 0.1135939503107606, 4.8963989788039095, 0.06631596224894384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 249.09523809523807, 135, 839, 149.0, 524.4000000000001, 809.8999999999996, 839.0, 0.11334625120767733, 1.6161223066771737, 0.06628204561646867], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 30.76923076923077, 0.312256049960968], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 7.6923076923076925, 0.078064012490242], "isController": false}, {"data": ["Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, 7.6923076923076925, 0.078064012490242], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 7.6923076923076925, 0.078064012490242], "isController": false}, {"data": ["401/Unauthorized", 5, 38.46153846153846, 0.39032006245121], "isController": false}, {"data": ["Assertion failed", 1, 7.6923076923076925, 0.078064012490242], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1281, 13, "401/Unauthorized", 5, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 1, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, "Test failed: code expected to contain /204/", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books", 56, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 1, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
