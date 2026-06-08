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

    var data = {"OkPercent": 98.2536066818527, "KoPercent": 1.7463933181473046};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8092447916666666, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.38596491228070173, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8d9584b3-25b0-4d44-891c-a9697f57b57e"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1a421ed2-d89c-47de-8357-1d25c02499db"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3b6e2b7e-6037-45e7-af7b-276e9aaae846"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/686d3ed0-ff3b-4aad-83b0-b2fcba4b9802"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3a7b040e-47fe-4dc4-8881-92faaf6a2ac0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=70497e73-d760-4f50-8374-b8480797b1f4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c74d55fc-04f4-4d9e-9c17-9c75e4ff46e4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d2bf53be-1794-454f-8e6b-a60355c3a002"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f66f79c5-bed6-410e-a0ad-761ddf17a447"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d2c49d4d-1e27-4d58-9203-aeeed95940db"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7b76aaa7-f6bd-4968-a4bd-591544767033"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/18ffe8cb-f970-4793-a076-bada2f784359"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6a12d16a-a0a2-460d-aa9d-4c3145b66e90"], "isController": false}, {"data": [0.3125, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=15451bb3-23a8-4c8a-83fd-ac1ebe95f1b0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7b76aaa7-f6bd-4968-a4bd-591544767033"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8d9584b3-25b0-4d44-891c-a9697f57b57e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3b6e2b7e-6037-45e7-af7b-276e9aaae846"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2619047619047619, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b297351a-6bcb-4c20-9dbf-7d7f9977e065"], "isController": false}, {"data": [0.3135593220338983, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f6c01d90-bcd8-4c06-9cb2-81af2db87716"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/70497e73-d760-4f50-8374-b8480797b1f4"], "isController": false}, {"data": [0.8070175438596491, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9114285714285715, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3ad23a3d-dbfc-43b4-a07b-449e37a3fbe5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d2bf53be-1794-454f-8e6b-a60355c3a002"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b297351a-6bcb-4c20-9dbf-7d7f9977e065"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f6c01d90-bcd8-4c06-9cb2-81af2db87716"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c74d55fc-04f4-4d9e-9c17-9c75e4ff46e4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1a421ed2-d89c-47de-8357-1d25c02499db"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/15451bb3-23a8-4c8a-83fd-ac1ebe95f1b0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d2c49d4d-1e27-4d58-9203-aeeed95940db"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a12d16a-a0a2-460d-aa9d-4c3145b66e90"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=18ffe8cb-f970-4793-a076-bada2f784359"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1317, 23, 1.7463933181473046, 301.5163249810173, 76, 2247, 95.0, 857.2, 1025.7999999999993, 1533.3799999999994, 5.176113630825584, 727.4604156697801, 3.7761877709402687], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1329.245614035088, 939, 2102, 1308.0, 1574.4, 1632.6999999999991, 2102.0, 0.24837900020916126, 298.88313451438637, 1.2212776035675068], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8d9584b3-25b0-4d44-891c-a9697f57b57e", 3, 0, 0.0, 336.3333333333333, 193, 424, 392.0, 424.0, 424.0, 424.0, 0.02453566258556812, 0.02460754440954928, 0.015734132582542058], "isController": false}, {"data": ["deleteBook", 15, 1, 6.666666666666667, 617.3333333333334, 85, 1072, 538.0, 992.8000000000001, 1072.0, 1072.0, 0.0775506405682911, 0.014601331544498558, 0.05246280638965578], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, 6.666666666666667, 617.3333333333334, 85, 1072, 538.0, 992.8000000000001, 1072.0, 1072.0, 0.0770641636226322, 0.014509737057073719, 0.05213370600278459], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1a421ed2-d89c-47de-8357-1d25c02499db", 1, 0, 0.0, 522.0, 522, 522, 522.0, 522.0, 522.0, 522.0, 1.9157088122605364, 0.3460997365900383, 1.3207914272030652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 102.71428571428572, 77, 235, 80.0, 234.0, 235.0, 235.0, 0.11908711222259082, 0.07019294770374529, 0.06577369939861008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 93.28571428571428, 79, 241, 81.0, 168.5, 241.0, 241.0, 0.11907090672495471, 0.08848921876727592, 0.05976801372717453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 226.92857142857142, 79, 701, 88.5, 666.0, 701.0, 701.0, 0.11853156326198863, 7.493433801180236, 0.06761656838424547], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 285.57142857142856, 78, 1097, 80.0, 981.5, 1097.0, 1097.0, 0.11831419178730489, 22.837766880371678, 0.06737702718691108], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b6e2b7e-6037-45e7-af7b-276e9aaae846", 3, 0, 0.0, 751.0, 185, 1708, 360.0, 1708.0, 1708.0, 1708.0, 0.020422333864314014, 0.028153835909951123, 0.013096353422102412], "isController": false}, {"data": ["goToProfile", 15, 1, 6.666666666666667, 206.20000000000002, 81, 362, 197.0, 310.40000000000003, 362.0, 362.0, 0.07706337177939326, 0.14319438111690513, 0.049815248593593466], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/686d3ed0-ff3b-4aad-83b0-b2fcba4b9802", 1, 0, 0.0, 377.0, 377, 377, 377.0, 377.0, 377.0, 377.0, 2.6525198938992043, 0.8470449270557029, 1.5827047413793103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 22, 0, 0.0, 90.77272727272728, 79, 235, 81.0, 100.49999999999999, 215.49999999999972, 235.0, 0.11474828399157122, 0.08527680089607978, 0.057598259737956646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 22, 0, 0.0, 88.54545454545456, 76, 242, 80.5, 90.8, 219.4999999999997, 242.0, 0.1147458900108487, 0.0385372604679546, 0.06500297622152215], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 581.75, 467, 625, 617.5, 625.0, 625.0, 625.0, 0.0406528853385369, 11.953298092363354, 0.023184848669634325], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 960.25, 812, 1163, 933.0, 1163.0, 1163.0, 1163.0, 0.04052643843527422, 36.4657605419398, 0.023073157820082877], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 81.0, 79, 83, 81.0, 83.0, 83.0, 83.0, 0.04087680752133258, 0.07233278830923305, 0.022633935414644115], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a7b040e-47fe-4dc4-8881-92faaf6a2ac0", 1, 0, 0.0, 293.0, 293, 293, 293.0, 293.0, 293.0, 293.0, 3.4129692832764507, 1.0898837457337884, 2.0364494453924915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 81.40000000000002, 78, 88, 80.5, 87.6, 88.0, 88.0, 0.05874715810622661, 0.043658776678553175, 0.02948831959628953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 95.1, 77, 237, 79.0, 221.40000000000006, 237.0, 237.0, 0.05874715810622661, 0.015719454415142668, 0.03350423860745736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 110.10000000000002, 78, 236, 79.5, 235.6, 236.0, 236.0, 0.05869371272949242, 0.015819789759121003, 0.03450548346011175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 158.80000000000004, 79, 242, 157.5, 241.9, 242.0, 242.0, 0.058694057226705794, 0.015819882611885546, 0.034563004402054294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 119.5, 80, 235, 81.5, 235.0, 235.0, 235.0, 0.04087638979725311, 0.03037786390206017, 0.022953050911543493], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 583.875, 78, 1046, 815.5, 1015.9, 1046.0, 1046.0, 0.08857052704999253, 49.81889965305264, 0.047312576461275305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 22, 0, 0.0, 147.50000000000003, 78, 925, 81.0, 237.9, 822.2499999999985, 925.0, 0.11466037076994438, 4.719118126566808, 0.06695986496135424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 437.93750000000006, 76, 704, 545.0, 676.7, 704.0, 704.0, 0.08849459629871352, 16.271663027787305, 0.047358436300483406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 22, 0, 0.0, 128.27272727272725, 79, 624, 81.0, 241.29999999999998, 566.9999999999992, 624.0, 0.11465798045602606, 1.5619197882736156, 0.06707043973941368], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 430.85714285714283, 83, 1232, 400.5, 930.0, 1232.0, 1232.0, 0.0801428833119619, 0.015133006774935887, 0.054846667701845576], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=70497e73-d760-4f50-8374-b8480797b1f4", 1, 0, 0.0, 371.0, 371, 371, 371.0, 371.0, 371.0, 371.0, 2.6954177897574128, 0.48696512803234504, 1.858364218328841], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 241.20000000000002, 159, 325, 241.5, 324.6, 325.0, 325.0, 0.05866582187883161, 0.0909205657438533, 0.13194080838569258], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 578.857142857143, 122, 1237, 548.0, 1156.0000000000002, 1233.2, 1237.0, 0.09721682128770624, 0.059716191982389866, 0.04395643384395311], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 90.18749999999999, 79, 235, 80.0, 128.6000000000001, 235.0, 235.0, 0.08857101734884802, 0.06582279707272788, 0.044458498942683486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 129.31250000000003, 78, 242, 81.0, 239.2, 242.0, 242.0, 0.08857101734884802, 0.10684311443375442, 0.04586404487229167], "isController": false}, {"data": ["login", 21, 0, 0.0, 2584.3809523809523, 1486, 3721, 2496.0, 3671.8, 3719.9, 3721.0, 0.0955527041415272, 21.90699487029858, 0.17434902587430723], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 22, 0, 0.0, 101.95454545454545, 81, 241, 85.5, 202.1999999999999, 240.85, 241.0, 0.11353783906527393, 0.09191686385264852, 0.0403591537302341], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c74d55fc-04f4-4d9e-9c17-9c75e4ff46e4", 3, 0, 0.0, 347.6666666666667, 206, 561, 276.0, 561.0, 561.0, 561.0, 0.08437869156775608, 0.03817916057265005, 0.05411003332958317], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d2bf53be-1794-454f-8e6b-a60355c3a002", 3, 0, 0.0, 507.3333333333333, 199, 1025, 298.0, 1025.0, 1025.0, 1025.0, 0.04716165443083743, 0.030320399577117168, 0.030243639071858643], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f66f79c5-bed6-410e-a0ad-761ddf17a447", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 1.6896081349206349, 3.1570353835978837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 704.2500000000001, 161, 1127, 897.5, 1096.2, 1127.0, 1127.0, 0.08845545714885948, 66.1910825323968, 0.18479329756415785], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d2c49d4d-1e27-4d58-9203-aeeed95940db", 3, 0, 0.0, 334.0, 209, 569, 224.0, 569.0, 569.0, 569.0, 0.09732991597183921, 0.044039252344028806, 0.06241534325017033], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7b76aaa7-f6bd-4968-a4bd-591544767033", 1, 0, 0.0, 169.0, 169, 169, 169.0, 169.0, 169.0, 169.0, 5.9171597633136095, 1.069018121301775, 4.0796042899408285], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/18ffe8cb-f970-4793-a076-bada2f784359", 3, 0, 0.0, 759.0, 222, 1137, 918.0, 1137.0, 1137.0, 1137.0, 0.042234485865525404, 0.027152704942842665, 0.02708396391767091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 413.07142857142856, 159, 1178, 316.0, 1063.0, 1178.0, 1178.0, 0.11821728336682824, 30.45016145367149, 0.25939194095891105], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 747.1666666666667, 81, 1246, 957.0, 1246.0, 1246.0, 1246.0, 0.05377404147771066, 42.89309524503038, 0.09271295920790837], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a12d16a-a0a2-460d-aa9d-4c3145b66e90", 3, 0, 0.0, 263.0, 186, 414, 189.0, 414.0, 414.0, 414.0, 0.04533708119871243, 0.028734146189418323, 0.029073583971830557], "isController": false}, {"data": ["register", 24, 5, 20.833333333333332, 1063.2916666666667, 321, 2010, 969.0, 1682.5, 1946.75, 2010.0, 0.0976185149783409, 0.030934773545382443, 0.04404272843749365], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 22, 0, 0.0, 84.72727272727273, 80, 104, 83.0, 91.4, 102.19999999999997, 104.0, 0.09720749381406858, 0.07546870857635207, 0.03455422631671969], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 22, 0, 0.0, 248.86363636363637, 161, 1008, 171.0, 431.6999999999999, 928.3499999999989, 1008.0, 0.11460780687542652, 6.401854326640064, 0.2564227582452503], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=15451bb3-23a8-4c8a-83fd-ac1ebe95f1b0", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7b76aaa7-f6bd-4968-a4bd-591544767033", 3, 0, 0.0, 440.66666666666663, 216, 699, 407.0, 699.0, 699.0, 699.0, 0.07380800078728533, 0.03421308369827289, 0.04733130258820056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 250.05882352941177, 161, 326, 315.0, 324.4, 326.0, 326.0, 0.09553352664823432, 0.1480583074128397, 0.21485714049890978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 107.14285714285714, 79, 233, 90.0, 233.0, 233.0, 233.0, 0.045565797010883716, 0.0338628628176587, 0.02287189420272874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 104.42857142857143, 78, 248, 79.0, 248.0, 248.0, 248.0, 0.04556905991029405, 0.021970796742463203, 0.025441877477817634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 215.14285714285714, 77, 858, 88.0, 858.0, 858.0, 858.0, 0.04552312574787992, 5.862201142711748, 0.026203741188023516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 134.57142857142858, 79, 460, 79.0, 460.0, 460.0, 460.0, 0.045568763263765015, 1.9246318084614682, 0.02627451151913237], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 83.0, 83, 83, 83.0, 83.0, 83.0, 83.0, 12.048192771084338, 3.5532756024096384, 7.447759789156626], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 920.3157894736843, 615, 1718, 860.0, 1219.8000000000002, 1282.999999999999, 1718.0, 0.24565577161770788, 293.8897066191301, 0.4850741896591849], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, 20.833333333333332, 1063.2916666666667, 321, 2010, 969.0, 1682.5, 1946.75, 2010.0, 0.0974552010622617, 0.03088302025849992, 0.0439690457917626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 99.875, 78, 233, 81.0, 233.0, 233.0, 233.0, 0.03652334298158311, 0.009844182288004821, 0.021507398259662705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 99.875, 76, 242, 79.5, 242.0, 242.0, 242.0, 0.036523843221402966, 0.00984431711826877, 0.021472025018832608], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8d9584b3-25b0-4d44-891c-a9697f57b57e", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.4539298052763819, 1.7322942839195978], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3b6e2b7e-6037-45e7-af7b-276e9aaae846", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 22, 0, 0.0, 139.6818181818182, 78, 921, 80.0, 238.0, 818.5499999999986, 921.0, 0.09909374268057582, 4.078436814507774, 0.0578691973857269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 22, 0, 0.0, 130.09090909090907, 78, 705, 80.0, 246.0, 637.049999999999, 705.0, 0.0990932963385027, 1.3498910396012846, 0.057965707526135855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 22, 0, 0.0, 88.77272727272728, 78, 236, 81.0, 94.6, 215.1499999999997, 236.0, 0.09909374268057582, 0.07364290837882637, 0.04974041380646091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 79.75, 78, 83, 79.5, 83.0, 83.0, 83.0, 0.0365236764732738, 0.009772936868825216, 0.020829909238663964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 22, 0, 0.0, 108.5, 77, 251, 80.0, 240.6, 249.79999999999998, 251.0, 0.09909418902666986, 0.033280656701694965, 0.05613636542783916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 103.125, 80, 235, 82.0, 235.0, 235.0, 235.0, 0.03652317623802154, 0.027142712028451556, 0.018332922447600656], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 111.25, 83, 238, 86.5, 238.0, 238.0, 238.0, 0.037689803494787025, 0.029665997672654636, 0.013397547336037577], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 606.3571428571428, 82, 1342, 537.5, 1183.5, 1342.0, 1342.0, 0.07878225148420134, 0.014722213429560226, 0.05361875193438564], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1436.6190476190477, 746, 2247, 1326.0, 2097.2000000000003, 2236.3999999999996, 2247.0, 0.09834177043284428, 0.05089954914981198, 0.04523337292370084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 205.0, 160, 477, 166.0, 477.0, 477.0, 477.0, 0.03650950844510567, 0.0565826073265456, 0.08211074018464684], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b297351a-6bcb-4c20-9dbf-7d7f9977e065", 3, 0, 0.0, 676.3333333333334, 362, 954, 713.0, 954.0, 954.0, 954.0, 0.04292213923941969, 0.027594799803988896, 0.027524939551320567], "isController": false}, {"data": ["addBook", 59, 14, 23.728813559322035, 850.9661016949154, 402, 1795, 696.0, 1533.0, 1637.0, 1795.0, 0.28587071860146235, 93.86047112796591, 1.0372418911438221], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f6c01d90-bcd8-4c06-9cb2-81af2db87716", 3, 0, 0.0, 287.0, 160, 425, 276.0, 425.0, 425.0, 425.0, 0.01692944934144442, 0.023338612617518597, 0.010856450261277836], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 154.15789473684208, 77, 594, 82.0, 321.0, 330.99999999999983, 594.0, 0.24657285362656756, 0.1832440836033378, 0.11919293217299896], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70497e73-d760-4f50-8374-b8480797b1f4", 3, 0, 0.0, 307.0, 197, 514, 210.0, 514.0, 514.0, 514.0, 0.020484107746406747, 0.028238996193369975, 0.013135967532689221], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 511.0877192982459, 383, 712, 469.0, 688.8, 701.4, 712.0, 0.24657072037582567, 72.49997870894273, 0.1240077353452639], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 120.96491228070171, 78, 327, 82.0, 237.4, 252.99999999999955, 327.0, 0.2471298255350144, 0.437303949091256, 0.12018618468402067], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 764.6140350877193, 533, 1090, 774.0, 936.4, 988.1999999999994, 1090.0, 0.24632244905014608, 221.6413726440014, 0.1236423230583741], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 99.6470588235294, 81, 246, 84.0, 152.39999999999992, 246.0, 246.0, 0.10165336203545909, 0.07594220894250604, 0.03613459353604209], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 14, 8.0, 134.50857142857143, 79, 634, 86.0, 244.0, 320.7999999999997, 542.0400000000011, 0.7219859150862051, 1.575710086040093, 0.34557017806235485], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 126.14285714285714, 79, 241, 83.0, 241.0, 241.0, 241.0, 0.0468512606335629, 0.036282275080483775, 0.016654159053336816], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ad23a3d-dbfc-43b4-a07b-449e37a3fbe5", 2, 0, 0.0, 193.5, 173, 214, 193.5, 214.0, 214.0, 214.0, 0.02591378483784449, 0.02925423366459788, 0.01610754301688283], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 95.5, 80, 233, 83.0, 165.0, 233.0, 233.0, 0.11738762231371004, 0.09526280677997366, 0.04172763136932661], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d2bf53be-1794-454f-8e6b-a60355c3a002", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b297351a-6bcb-4c20-9dbf-7d7f9977e065", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f6c01d90-bcd8-4c06-9cb2-81af2db87716", 1, 0, 0.0, 1232.0, 1232, 1232, 1232.0, 1232.0, 1232.0, 1232.0, 0.8116883116883118, 0.14664290787337664, 0.5596210430194806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 322.99999999999994, 160, 1091, 172.0, 1091.0, 1091.0, 1091.0, 0.04549620106721089, 7.8360478384429895, 0.1006590754359511], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 22, 0, 0.0, 251.72727272727272, 159, 1018, 163.5, 432.0999999999999, 936.5499999999988, 1018.0, 0.09905715597899988, 5.533213660375787, 0.221629833538952], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c74d55fc-04f4-4d9e-9c17-9c75e4ff46e4", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 5.58659217877095, 1.009296438547486, 3.85169343575419], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 100.4, 84, 199, 89.5, 188.90000000000003, 199.0, 199.0, 0.05926417599089702, 0.04913602091432771, 0.021066562559264177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1a421ed2-d89c-47de-8357-1d25c02499db", 3, 0, 0.0, 306.6666666666667, 187, 475, 258.0, 475.0, 475.0, 475.0, 0.027588490081937814, 0.027848928302112358, 0.017691837715305175], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 89.625, 80, 140, 83.5, 116.20000000000002, 140.0, 140.0, 0.08676695480526242, 0.0673630166701012, 0.030842940965933128], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/15451bb3-23a8-4c8a-83fd-ac1ebe95f1b0", 3, 0, 0.0, 617.3333333333333, 176, 1342, 334.0, 1342.0, 1342.0, 1342.0, 0.04486182557722215, 0.028841831222335208, 0.028768813928101447], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d2c49d4d-1e27-4d58-9203-aeeed95940db", 1, 0, 0.0, 338.0, 338, 338, 338.0, 338.0, 338.0, 338.0, 2.9585798816568047, 0.5345090606508875, 2.0398021449704142], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a12d16a-a0a2-460d-aa9d-4c3145b66e90", 1, 0, 0.0, 628.0, 628, 628, 628.0, 628.0, 628.0, 628.0, 1.5923566878980893, 0.2876816281847134, 1.0978552945859872], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=18ffe8cb-f970-4793-a076-bada2f784359", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 0.46443203727506427, 1.7723730719794344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 84.88235294117646, 78, 158, 80.0, 97.99999999999994, 158.0, 158.0, 0.09557971910807256, 0.07103141234496407, 0.04797653869291923], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 89.58823529411765, 78, 236, 80.0, 115.19999999999989, 236.0, 236.0, 0.09557756963107059, 0.025574466873938807, 0.054509082680219936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 144.58823529411765, 79, 239, 83.0, 237.4, 239.0, 239.0, 0.09558025649242949, 0.025761866007725134, 0.05619073672699468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 126.82352941176471, 79, 243, 80.0, 243.0, 243.0, 243.0, 0.09557703227692602, 0.025760996980890218, 0.05628217818651015], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 21.73913043478261, 0.37965072133637057], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.3478260869565215, 0.07593014426727411], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.3478260869565215, 0.07593014426727411], "isController": false}, {"data": ["401/Unauthorized", 16, 69.56521739130434, 1.2148823082763858], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1317, 23, "401/Unauthorized", 16, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
