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

    var data = {"OkPercent": 99.34086629001884, "KoPercent": 0.6591337099811676};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7392712550607288, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.08333333333333333, 500, 1500, "see books"], "isController": true}, {"data": [0.7, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8729c997-1050-49cf-82dc-20847498597d"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=177c3706-f507-4ffa-9b4b-961d9ef4a88f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7cb1d24d-8a89-47b8-afd2-3894c7295718"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6231155e-7ef8-4b2d-b86c-6e8b85b15901"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6e8d1b98-beb3-4962-b1a3-ab6e04189deb"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.65, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f742dd47-14a5-4b41-b387-707da0167ac4"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/6231155e-7ef8-4b2d-b86c-6e8b85b15901"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/6a0be23c-d02c-4812-9ba2-c7c28bc41c98"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b93f2cf0-bd23-4143-85f2-f89bcd54d900"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c2a33c02-c71e-42dd-b0ff-fa7cc61dbe80"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8125, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1006a5e9-f214-41f0-9a23-9649c113ad9a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9c0c714b-fbf3-406e-a96f-edec643a0ad4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/edc515e8-f7c2-476a-8b87-8ddb28c51baa"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=69e0a7d9-94a8-46b7-b686-68cc523ce5aa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6cfcd63b-66aa-4171-a725-fc471ec545a3"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f5dfe7fe-ac04-4a9a-a2b8-b8b9bdcb7af2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3e7840a8-ae95-4e95-a74a-5ad63d9fdf82"], "isController": false}, {"data": [0.3, 500, 1500, "register"], "isController": true}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/177c3706-f507-4ffa-9b4b-961d9ef4a88f"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.34210526315789475, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1006a5e9-f214-41f0-9a23-9649c113ad9a"], "isController": false}, {"data": [0.28888888888888886, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/736a0ce9-9762-4170-a97a-d3297257e240"], "isController": false}, {"data": [0.9895833333333334, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8260869565217391, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f742dd47-14a5-4b41-b387-707da0167ac4"], "isController": false}, {"data": [0.9047619047619048, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6e8d1b98-beb3-4962-b1a3-ab6e04189deb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7cb1d24d-8a89-47b8-afd2-3894c7295718"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/69e0a7d9-94a8-46b7-b686-68cc523ce5aa"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8729c997-1050-49cf-82dc-20847498597d"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f5dfe7fe-ac04-4a9a-a2b8-b8b9bdcb7af2"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6cfcd63b-66aa-4171-a725-fc471ec545a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1062, 7, 0.6591337099811676, 1166.6619585687379, 100, 47332, 208.5, 1209.4, 2039.749999999986, 25280.65999999991, 4.172068355922216, 623.0862674327244, 3.030593203692791], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 48, 0, 0.0, 8224.166666666666, 1344, 39907, 1786.0, 30306.600000000002, 35838.049999999996, 39907.0, 0.2168981753440999, 261.00211052091714, 1.0664866336499446], "isController": true}, {"data": ["deleteBook", 10, 0, 0.0, 640.3000000000001, 430, 1086, 541.5, 1069.5, 1086.0, 1086.0, 0.08288987251537606, 0.014975221108734935, 0.05633921022529467], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 10, 0, 0.0, 640.3000000000001, 430, 1086, 541.5, 1069.5, 1086.0, 1086.0, 0.08073240437246701, 0.014585444149322654, 0.05487280609691118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 151.09523809523807, 101, 307, 103.0, 305.8, 306.9, 307.0, 0.10321591294475, 0.03500048536054302, 0.05845253849707801], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 114.0952380952381, 102, 306, 104.0, 111.0, 286.59999999999974, 306.0, 0.10331696661386021, 0.07678145663393322, 0.0518602742573478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 145.76190476190473, 101, 803, 103.0, 266.0000000000001, 753.2999999999993, 803.0, 0.10296489877569832, 1.4681021025677485, 0.06021129102048021], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 159.95238095238096, 100, 898, 103.0, 304.8, 838.6999999999991, 898.0, 0.10291696071512585, 4.436173757216439, 0.0600827532002274], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8729c997-1050-49cf-82dc-20847498597d", 3, 0, 0.0, 375.0, 199, 654, 272.0, 654.0, 654.0, 654.0, 0.0156400698589787, 0.018486033091781144, 0.010029602090556004], "isController": false}, {"data": ["goToProfile", 11, 0, 0.0, 798.2727272727273, 199, 6172, 248.0, 5019.600000000004, 6172.0, 6172.0, 0.07359631750789487, 0.11943720561472997, 0.04757886932639298], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 167.37499999999997, 102, 312, 103.0, 311.3, 312.0, 312.0, 0.08912606324608263, 0.06623528723659071, 0.044737105965318824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 143.06249999999994, 101, 307, 103.0, 305.6, 307.0, 307.0, 0.08912308454995628, 0.040579724776774524, 0.049892390838146915], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 2, 0, 0.0, 809.5, 703, 916, 809.5, 916.0, 916.0, 916.0, 0.019788852939139383, 5.818579815864724, 0.01128583019185293], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 2, 0, 0.0, 957.5, 813, 1102, 957.5, 1102.0, 1102.0, 1102.0, 0.01975230608173504, 17.773159733195726, 0.011245697700831572], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 2, 0, 0.0, 102.0, 102, 102, 102.0, 102.0, 102.0, 102.0, 0.019949328705089073, 0.03530096056017715, 0.01104616149979053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 8, 0, 0.0, 128.875, 101, 307, 103.5, 307.0, 307.0, 307.0, 0.050027827979313495, 0.037178883879157784, 0.025111624591178845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 8, 0, 0.0, 154.24999999999997, 101, 311, 103.5, 311.0, 311.0, 311.0, 0.05002845368303223, 0.013386519833155107, 0.028531852491104317], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=177c3706-f507-4ffa-9b4b-961d9ef4a88f", 1, 0, 0.0, 2940.0, 2940, 2940, 2940.0, 2940.0, 2940.0, 2940.0, 0.3401360544217687, 0.061450361394557826, 0.2345078656462585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 8, 0, 0.0, 153.25, 100, 310, 102.0, 310.0, 310.0, 310.0, 0.05002907940240265, 0.013484400307678838, 0.029411626758053117], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7cb1d24d-8a89-47b8-afd2-3894c7295718", 3, 0, 0.0, 277.0, 201, 428, 202.0, 428.0, 428.0, 428.0, 0.03448315497879286, 0.02841043790733227, 0.022113221128978497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 8, 0, 0.0, 102.75, 101, 104, 103.0, 104.0, 104.0, 104.0, 0.05002876654076094, 0.013484315981689473, 0.029460299046952], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6231155e-7ef8-4b2d-b86c-6e8b85b15901", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 0.8727732487922706, 3.330691425120773], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 2, 0, 0.0, 103.5, 103, 104, 103.5, 104.0, 104.0, 104.0, 0.019949328705089073, 0.01482562416462186, 0.01120201563029904], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e8d1b98-beb3-4962-b1a3-ab6e04189deb", 3, 0, 0.0, 462.33333333333337, 207, 770, 410.0, 770.0, 770.0, 770.0, 0.04635996971148646, 0.03034827444329403, 0.029729537868368593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 823.0, 102, 1305, 1004.0, 1262.5, 1305.0, 1305.0, 0.07471807270068473, 48.02822049903667, 0.03933956562114735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 282.0625, 101, 1141, 104.5, 1115.1000000000001, 1141.0, 1141.0, 0.08902489915148143, 10.034090711503687, 0.051380581443872586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 578.1428571428571, 101, 920, 706.5, 918.0, 920.0, 920.0, 0.07471926903206523, 15.698572628463772, 0.03941316353379446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 237.0, 102, 609, 113.0, 604.1, 609.0, 609.0, 0.08912308454995628, 3.2966620271602602, 0.051524283255443476], "isController": false}, {"data": ["deleteBooks", 10, 0, 0.0, 895.5999999999999, 192, 2940, 510.0, 2865.0, 2940.0, 2940.0, 0.08078653773135244, 0.014595224101855667, 0.05569853089681136], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f742dd47-14a5-4b41-b387-707da0167ac4", 3, 0, 0.0, 655.6666666666666, 215, 1241, 511.0, 1241.0, 1241.0, 1241.0, 0.019948665434282448, 0.016630381568098096, 0.012792601206229303], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6231155e-7ef8-4b2d-b86c-6e8b85b15901", 3, 0, 0.0, 2898.333333333333, 460, 6172, 2063.0, 6172.0, 6172.0, 6172.0, 0.028819274330672353, 0.013039971132693546, 0.018481110166479343], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 8, 0, 0.0, 284.75, 204, 613, 210.0, 613.0, 613.0, 613.0, 0.049995625382779005, 0.07748345457272489, 0.11244133325833988], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a0be23c-d02c-4812-9ba2-c7c28bc41c98", 1, 0, 0.0, 8642.0, 8642, 8642, 8642.0, 8642.0, 8642.0, 8642.0, 0.11571395510298542, 0.03695162433464476, 0.06904416657023837], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b93f2cf0-bd23-4143-85f2-f89bcd54d900", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 1.6545903497409327, 3.091604598445596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 3591.7368421052633, 331, 26151, 884.0, 17695.0, 26151.0, 26151.0, 0.08402469441545346, 0.05161282498761741, 0.037991634291362264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 147.42857142857144, 102, 310, 104.0, 309.0, 310.0, 310.0, 0.07471767393207096, 0.0555274900999082, 0.037504769922934056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 232.57142857142856, 102, 311, 302.0, 309.0, 311.0, 311.0, 0.07471807270068473, 0.10015223807312763, 0.03813040038212957], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2a33c02-c71e-42dd-b0ff-fa7cc61dbe80", 1, 0, 0.0, 199.0, 199, 199, 199.0, 199.0, 199.0, 199.0, 5.025125628140704, 1.6047032035175879, 2.998390389447236], "isController": false}, {"data": ["login", 19, 0, 0.0, 11791.105263157895, 1978, 52153, 3428.0, 36776.0, 52153.0, 52153.0, 0.0824051906595885, 10.49420954447278, 0.13871568664125117], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 3623.25, 102, 26085, 109.0, 18835.100000000006, 26085.0, 26085.0, 0.0901855567830812, 0.07301154938786553, 0.03205814713773589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1006a5e9-f214-41f0-9a23-9649c113ad9a", 3, 0, 0.0, 491.0, 266, 829, 378.0, 829.0, 829.0, 829.0, 0.03774486984310716, 0.02426631443363823, 0.024204880726211297], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9c0c714b-fbf3-406e-a96f-edec643a0ad4", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 1.3764480064655171, 2.571895204741379], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/edc515e8-f7c2-476a-8b87-8ddb28c51baa", 1, 0, 0.0, 324.0, 324, 324, 324.0, 324.0, 324.0, 324.0, 3.0864197530864197, 0.9856047453703703, 1.841603973765432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 971.857142857143, 207, 1524, 1156.0, 1466.0, 1524.0, 1524.0, 0.07467582690143325, 63.846102621921624, 0.15430017748843858], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=69e0a7d9-94a8-46b7-b686-68cc523ce5aa", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 0.9409586588541666, 3.590901692708333], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6cfcd63b-66aa-4171-a725-fc471ec545a3", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 294.6666666666667, 206, 1003, 210.0, 571.0000000000001, 963.7999999999995, 1003.0, 0.10286201305857748, 6.011764230469687, 0.2300858300841999], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 2, 0, 0.0, 1061.5, 916, 1207, 1061.5, 1207.0, 1207.0, 1207.0, 0.019732233590181242, 23.60661140819085, 0.04449387437473485], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f5dfe7fe-ac04-4a9a-a2b8-b8b9bdcb7af2", 1, 0, 0.0, 553.0, 553, 553, 553.0, 553.0, 553.0, 553.0, 1.8083182640144664, 0.32669812386980107, 1.246750678119349], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e7840a8-ae95-4e95-a74a-5ad63d9fdf82", 2, 0, 0.0, 337.5, 278, 397, 337.5, 397.0, 397.0, 397.0, 0.03469210754553339, 0.029237586730268866, 0.021563990676496097], "isController": false}, {"data": ["register", 20, 3, 15.0, 4991.75, 536, 27586, 1143.0, 23734.500000000004, 27400.799999999996, 27586.0, 0.08194068313947533, 0.026134596790383442, 0.03696933165081797], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 483.9375, 206, 1449, 324.5, 1426.6, 1449.0, 1449.0, 0.08897341363183914, 13.426046845197382, 0.19725770732195586], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 9, 0, 0.0, 108.22222222222223, 104, 116, 107.0, 116.0, 116.0, 116.0, 0.07841428882596384, 0.060878280875626224, 0.027873829231104333], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/177c3706-f507-4ffa-9b4b-961d9ef4a88f", 3, 0, 0.0, 337.6666666666667, 248, 489, 276.0, 489.0, 489.0, 489.0, 0.03508320566944603, 0.029247425038883886, 0.022498019260679913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 441.4117647058824, 206, 1212, 213.0, 1048.8, 1212.0, 1212.0, 0.0939600282985497, 19.95677968238747, 0.20707585510534576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 4, 0, 0.0, 207.75, 103, 316, 206.0, 316.0, 316.0, 316.0, 0.03780432481475881, 0.028094815609405716, 0.01897599897928323], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 4, 0, 0.0, 152.75, 100, 305, 103.0, 305.0, 305.0, 305.0, 0.03780575403576424, 0.010115992779100979, 0.021561094098521794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 4, 0, 0.0, 179.75, 101, 412, 103.0, 412.0, 412.0, 412.0, 0.037805396720381836, 0.010189735834790416, 0.022225438306318224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 4, 0, 0.0, 203.0, 102, 305, 202.5, 305.0, 305.0, 305.0, 0.03780503941175359, 0.01018963952894921, 0.02226214723172599], "isController": false}, {"data": ["https://demoqa.com/books", 48, 0, 0.0, 1222.083333333333, 808, 1742, 1114.0, 1683.6000000000001, 1723.95, 1742.0, 0.2234044038593111, 267.2693349530153, 0.4411364302768818], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 3, 15.0, 4991.75, 536, 27586, 1143.0, 23734.500000000004, 27400.799999999996, 27586.0, 0.08173807850125059, 0.026069976990730902, 0.03687792213630642], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 102.75, 101, 104, 103.0, 104.0, 104.0, 104.0, 0.020289634532957974, 0.0054686905577113285, 0.011947900022825838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 154.75, 101, 304, 107.0, 304.0, 304.0, 304.0, 0.020289840369680893, 0.005468746037140553, 0.011928206936081931], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 9, 0, 0.0, 125.44444444444444, 101, 302, 103.0, 302.0, 302.0, 302.0, 0.08234519104084322, 0.022194602272727272, 0.04840996582674571], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 9, 0, 0.0, 159.88888888888889, 101, 412, 103.0, 412.0, 412.0, 412.0, 0.08211304228821678, 0.022132030929245927, 0.04835367626933078], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 153.25, 102, 304, 103.5, 304.0, 304.0, 304.0, 0.020289737450797388, 0.005429089903826644, 0.011571490889907884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 9, 0, 0.0, 103.11111111111111, 102, 104, 103.0, 104.0, 104.0, 104.0, 0.08234443763323787, 0.06119542679579495, 0.041333047796371356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 104.0, 103, 105, 104.0, 105.0, 105.0, 105.0, 0.02028932578570414, 0.015078297776289894, 0.010184290482277274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 9, 0, 0.0, 148.11111111111111, 102, 305, 103.0, 305.0, 305.0, 305.0, 0.08234594446223524, 0.022033973420559037, 0.04696292145111853], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 3341.2500000000005, 104, 13041, 110.0, 13041.0, 13041.0, 13041.0, 0.021283048583879156, 0.016752087068951756, 0.007565458676300793], "isController": false}, {"data": ["deleteAccount", 10, 0, 0.0, 554.5, 391, 829, 500.0, 823.1, 829.0, 829.0, 0.08382791804982731, 0.015144692225798879, 0.057058651250712536], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 5816.42105263158, 963, 30028, 1302.0, 24978.0, 30028.0, 30028.0, 0.08306991426310428, 0.04299517046820827, 0.03820891564250206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 260.25, 208, 409, 212.0, 409.0, 409.0, 409.0, 0.020278628353578167, 0.031427913278445845, 0.04560711044754932], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1006a5e9-f214-41f0-9a23-9649c113ad9a", 1, 0, 0.0, 2190.0, 2190, 2190, 2190.0, 2190.0, 2190.0, 2190.0, 0.45662100456621, 0.08249500570776255, 0.3148187785388128], "isController": false}, {"data": ["addBook", 45, 4, 8.88888888888889, 6898.244444444445, 546, 57178, 999.0, 33330.19999999998, 53119.39999999996, 57178.0, 0.2070088599792071, 88.87010305447323, 0.7472983906211186], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/736a0ce9-9762-4170-a97a-d3297257e240", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.8023516017587939, 1.499195194723618], "isController": false}, {"data": ["https://demoqa.com/books-0", 48, 0, 0.0, 215.62499999999986, 102, 553, 105.0, 418.1, 463.54999999999984, 553.0, 0.22435043538006366, 0.16672918098069184, 0.1084506499151675], "isController": false}, {"data": ["https://demoqa.com/books-3", 48, 0, 0.0, 649.375, 504, 918, 605.0, 860.7, 915.1, 918.0, 0.2242980172989846, 65.9510644810071, 0.11280613174704791], "isController": false}, {"data": ["https://demoqa.com/books-1", 48, 0, 0.0, 169.02083333333337, 102, 316, 107.0, 310.1, 311.0, 316.0, 0.22472225733507495, 0.3976530569249568, 0.10928875405553448], "isController": false}, {"data": ["https://demoqa.com/books-2", 48, 0, 0.0, 1004.7291666666669, 703, 1409, 1004.5, 1302.7, 1311.55, 1409.0, 0.22388268547281226, 201.45003393221953, 0.11237861360647021], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 3017.4705882352937, 104, 26186, 110.0, 22885.199999999997, 26186.0, 26186.0, 0.09458316642186318, 0.07066027569602083, 0.033621359939021676], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 138, 4, 2.898550724637681, 2604.876811594202, 103, 47332, 114.5, 8475.900000000025, 17859.349999999908, 44604.339999999895, 0.5939187880613717, 1.3773500879580813, 0.2821526126509006], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 4, 0, 0.0, 109.0, 104, 113, 109.5, 113.0, 113.0, 113.0, 0.03623385328912803, 0.028060005525662624, 0.01288000253636973], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f742dd47-14a5-4b41-b387-707da0167ac4", 1, 0, 0.0, 834.0, 834, 834, 834.0, 834.0, 834.0, 834.0, 1.199040767386091, 0.21662357613908872, 0.8266824040767387], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 1566.952380952381, 104, 20187, 112.0, 8512.000000000007, 19229.199999999986, 20187.0, 0.10241304644675497, 0.08311058749731776, 0.03640463760411993], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6e8d1b98-beb3-4962-b1a3-ab6e04189deb", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7cb1d24d-8a89-47b8-afd2-3894c7295718", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.3868609475374732, 1.476345021413276], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69e0a7d9-94a8-46b7-b686-68cc523ce5aa", 3, 0, 0.0, 3098.333333333333, 239, 8469, 587.0, 8469.0, 8469.0, 8469.0, 0.043464402654226186, 0.019666510315551562, 0.027872680087508327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 4, 0, 0.0, 439.25, 209, 715, 416.5, 715.0, 715.0, 715.0, 0.037767916155226136, 0.05853289349447644, 0.08494092861863847], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 9, 0, 0.0, 286.6666666666667, 206, 516, 209.0, 516.0, 516.0, 516.0, 0.08203520221677346, 0.1271385409355659, 0.18449909248557547], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8729c997-1050-49cf-82dc-20847498597d", 1, 0, 0.0, 703.0, 703, 703, 703.0, 703.0, 703.0, 703.0, 1.4224751066856332, 0.2569901315789474, 0.9807299075391182], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 8, 0, 0.0, 3986.125, 104, 17379, 109.0, 17379.0, 17379.0, 17379.0, 0.0498339905190833, 0.041317439404982156, 0.017714426317330393], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f5dfe7fe-ac04-4a9a-a2b8-b8b9bdcb7af2", 3, 0, 0.0, 1919.6666666666665, 229, 5104, 426.0, 5104.0, 5104.0, 5104.0, 0.02659433008882506, 0.02217059874918001, 0.01705430673013847], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 3965.1428571428573, 105, 24279, 120.0, 19463.0, 24279.0, 24279.0, 0.07161161949677493, 0.05559691162103131, 0.02545569286799421], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6cfcd63b-66aa-4171-a725-fc471ec545a3", 3, 0, 0.0, 5090.333333333334, 324, 14556, 391.0, 14556.0, 14556.0, 14556.0, 0.034500207001242005, 0.015610445225171351, 0.022124156182437092], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 142.5294117647059, 102, 355, 104.0, 313.4, 355.0, 355.0, 0.09437890353920889, 0.0701390093684941, 0.04737378556557946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 149.82352941176472, 100, 308, 103.0, 306.4, 308.0, 308.0, 0.09427265871079367, 0.0502123214364935, 0.05236768208486758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 297.58823529411757, 103, 1108, 104.0, 943.9999999999999, 1108.0, 1108.0, 0.09401614865612211, 14.949555972444973, 0.05384541602145781], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 238.70588235294122, 101, 805, 103.0, 803.4, 805.0, 805.0, 0.09401510878101116, 4.899144168712878, 0.05393663208846269], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 42.857142857142854, 0.2824858757062147], "isController": false}, {"data": ["401/Unauthorized", 4, 57.142857142857146, 0.3766478342749529], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1062, 7, "401/Unauthorized", 4, "406/Not Acceptable", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 138, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
