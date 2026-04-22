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

    var data = {"OkPercent": 98.99146625290923, "KoPercent": 1.008533747090768};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7655103402268179, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=336e9bfc-8baa-4e00-a9f2-cb848a8ecdd7"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5cf9589d-088b-493d-8948-5d6524eca3ca"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02dd3874-192e-49bb-b308-37b15f836410"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/525891ca-5ace-4262-a892-51f9b9aeb5b2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d425e6ee-9de5-4af2-b7c2-f2a1592ef6cd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4c435397-8119-43c7-be01-d23a74eb2c7b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3966b651-6d04-4984-abb4-b34f15a23dcb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d2a20e23-7c4e-4240-9a8e-9d1ffe837ff3"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/10dc86ad-91fc-4eb4-99fa-fa5e69633e15"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=55327cb1-aba2-4be6-b435-10d66c8ba788"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a4e47ec5-91b6-41b0-9b0a-be98276e468e"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1aa05f0f-b8e6-4e7f-9fdd-07e0e423c499"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=525891ca-5ace-4262-a892-51f9b9aeb5b2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ed420904-efd3-4326-9076-a81443113b48"], "isController": false}, {"data": [0.40625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/66e9b200-73e7-4ed3-b4e0-3f177b044d0a"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3966b651-6d04-4984-abb4-b34f15a23dcb"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5cf9589d-088b-493d-8948-5d6524eca3ca"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d2579633-a930-44bb-a88c-3df81cac6df2"], "isController": false}, {"data": [0.33035714285714285, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/46362c14-41e2-4d51-b1f7-39cf8f7e8d3b"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4318181818181818, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/02dd3874-192e-49bb-b308-37b15f836410"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4c435397-8119-43c7-be01-d23a74eb2c7b"], "isController": false}, {"data": [0.2807017543859649, 500, 1500, "addBook"], "isController": true}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d425e6ee-9de5-4af2-b7c2-f2a1592ef6cd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4732142857142857, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9441176470588235, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=10dc86ad-91fc-4eb4-99fa-fa5e69633e15"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/336e9bfc-8baa-4e00-a9f2-cb848a8ecdd7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1aa05f0f-b8e6-4e7f-9fdd-07e0e423c499"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f1d93de5-d47b-41fc-a1bb-50896801f5f6"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a4e47ec5-91b6-41b0-9b0a-be98276e468e"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ed420904-efd3-4326-9076-a81443113b48"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/55327cb1-aba2-4be6-b435-10d66c8ba788"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=46362c14-41e2-4d51-b1f7-39cf8f7e8d3b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1289, 13, 1.008533747090768, 430.78277734678085, 116, 2385, 147.0, 1231.0, 1459.5, 1829.2999999999988, 4.994304400722218, 717.0804592997125, 3.6459584492471735], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=336e9bfc-8baa-4e00-a9f2-cb848a8ecdd7", 1, 0, 0.0, 209.0, 209, 209, 209.0, 209.0, 209.0, 209.0, 4.784688995215311, 0.8644213516746412, 3.2988187799043063], "isController": false}, {"data": ["see books", 56, 0, 0.0, 2101.267857142858, 1528, 2906, 2060.5, 2456.8, 2641.3999999999996, 2906.0, 0.2331322567618762, 280.5373171629053, 1.1463094851523894], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5cf9589d-088b-493d-8948-5d6524eca3ca", 3, 0, 0.0, 344.0, 226, 479, 327.0, 479.0, 479.0, 479.0, 0.046685340802987856, 0.030014175809212573, 0.029938190553999374], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 552.1538461538462, 423, 889, 484.0, 855.8, 889.0, 889.0, 0.074287836795337, 0.013421142389782564, 0.05049251407183062], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 552.1538461538462, 423, 889, 484.0, 855.8, 889.0, 889.0, 0.07291286912139992, 0.013172735144002917, 0.04955796573095152], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02dd3874-192e-49bb-b308-37b15f836410", 1, 0, 0.0, 1017.0, 1017, 1017, 1017.0, 1017.0, 1017.0, 1017.0, 0.9832841691248771, 0.17764411258603738, 0.6779283431661751], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 22, 0, 0.0, 183.54545454545456, 123, 381, 127.0, 377.7, 380.55, 381.0, 0.12101875790747565, 0.048906017932779586, 0.06809453902854942], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 22, 0, 0.0, 161.95454545454547, 120, 386, 128.0, 377.4, 384.79999999999995, 386.0, 0.1210134324910065, 0.08993283410708588, 0.060743070605837245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 22, 0, 0.0, 296.1363636363637, 120, 1005, 130.0, 804.3999999999996, 1002.0, 1005.0, 0.12085123213324399, 3.260000611122708, 0.07022117492117204], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/525891ca-5ace-4262-a892-51f9b9aeb5b2", 3, 0, 0.0, 625.0, 233, 1350, 292.0, 1350.0, 1350.0, 1350.0, 0.023863500775563776, 0.028625325637354333, 0.015303091317662967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 22, 0, 0.0, 304.00000000000006, 125, 1488, 129.0, 895.9999999999995, 1432.0499999999993, 1488.0, 0.12084990441871195, 9.9151531532212, 0.07010238596163565], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 258.2307692307692, 213, 412, 229.0, 401.59999999999997, 412.0, 412.0, 0.07448149421336084, 0.147525056935373, 0.0481511222355907], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d425e6ee-9de5-4af2-b7c2-f2a1592ef6cd", 3, 0, 0.0, 556.6666666666666, 214, 1001, 455.0, 1001.0, 1001.0, 1001.0, 0.04836915337858536, 0.031096705052964222, 0.031017979217387096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 143.41176470588235, 122, 384, 129.0, 185.59999999999982, 384.0, 384.0, 0.07573732513588168, 0.056285258230865186, 0.03801658703109685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 155.11764705882356, 123, 370, 127.0, 360.4, 370.0, 370.0, 0.07573934971085389, 0.03364936412360662, 0.0424467541233393], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 957.8, 765, 1157, 948.0, 1157.0, 1157.0, 1157.0, 0.05654893179067847, 16.627263547710335, 0.03225056266187132], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1362.8, 1239, 1493, 1345.0, 1493.0, 1493.0, 1493.0, 0.056342472082305084, 50.697055419159824, 0.03207779416404674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 129.0, 124, 134, 127.0, 134.0, 134.0, 134.0, 0.05705938741041676, 0.10096836912858903, 0.03159440689619756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 126.90909090909089, 122, 133, 127.0, 132.2, 133.0, 133.0, 0.06345141064022473, 0.04715480810274514, 0.03184963385651906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 148.9090909090909, 120, 385, 126.0, 333.6000000000002, 385.0, 385.0, 0.06345214266349021, 0.016978405361129215, 0.03618755011277176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 126.45454545454544, 123, 129, 126.0, 129.0, 129.0, 129.0, 0.0634506786338492, 0.01710194072552967, 0.037302059118727755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 217.1818181818182, 120, 383, 128.0, 381.6, 383.0, 383.0, 0.0634506786338492, 0.01710194072552967, 0.037364022672081124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4c435397-8119-43c7-be01-d23a74eb2c7b", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3966b651-6d04-4984-abb4-b34f15a23dcb", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 178.8, 124, 376, 131.0, 376.0, 376.0, 376.0, 0.05706524840502631, 0.04240884183225099, 0.03204347444618177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 946.9999999999998, 125, 1608, 1295.5, 1577.9, 1608.0, 1608.0, 0.0734642527537616, 41.32196519458844, 0.03924311157842538], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 280.1764705882353, 121, 1496, 127.0, 1199.1999999999998, 1496.0, 1496.0, 0.07573901227417522, 8.035670777550065, 0.04376051157247555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 657.5625, 124, 1127, 857.0, 1125.6, 1127.0, 1127.0, 0.07346391544303332, 13.507944290246746, 0.0393146734988108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 243.76470588235296, 121, 998, 126.0, 991.6, 998.0, 998.0, 0.07573934971085389, 2.637998765894125, 0.043834670745453407], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d2a20e23-7c4e-4240-9a8e-9d1ffe837ff3", 1, 0, 0.0, 334.0, 334, 334, 334.0, 334.0, 334.0, 334.0, 2.9940119760479043, 0.9560956212574849, 1.7864661302395208], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 576.6923076923076, 209, 1017, 450.0, 930.1999999999999, 1017.0, 1017.0, 0.07277612942954712, 0.013148031195767788, 0.05017572986060572], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 347.09090909090907, 249, 519, 257.0, 517.0, 519.0, 519.0, 0.06340569267837173, 0.09826643972712495, 0.1426008889045802], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/10dc86ad-91fc-4eb4-99fa-fa5e69633e15", 3, 0, 0.0, 297.3333333333333, 213, 456, 223.0, 456.0, 456.0, 456.0, 0.028467589649184402, 0.028736326660846627, 0.018255583206019946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=55327cb1-aba2-4be6-b435-10d66c8ba788", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a4e47ec5-91b6-41b0-9b0a-be98276e468e", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 561.090909090909, 148, 1699, 470.0, 1078.8999999999999, 1608.9999999999986, 1699.0, 0.08893092896439933, 0.05462651788926482, 0.04020998057667665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 144.18749999999997, 122, 372, 128.0, 218.00000000000017, 372.0, 372.0, 0.07346324083086926, 0.05459524050028467, 0.03687510330768242], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 236.43750000000003, 122, 388, 129.5, 382.4, 388.0, 388.0, 0.07338035791269572, 0.08851863975747791, 0.037997983186725495], "isController": false}, {"data": ["login", 22, 0, 0.0, 2542.5, 1473, 4408, 2461.0, 3551.1, 4284.549999999998, 4408.0, 0.08703702238433966, 23.785111062454998, 0.16412165797615186], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 147.70588235294122, 127, 377, 131.0, 199.39999999999984, 377.0, 377.0, 0.07870625436935456, 0.06371824694550286, 0.027977613857856506], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1aa05f0f-b8e6-4e7f-9fdd-07e0e423c499", 1, 0, 0.0, 786.0, 786, 786, 786.0, 786.0, 786.0, 786.0, 1.272264631043257, 0.22985249681933842, 0.8771668256997455], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=525891ca-5ace-4262-a892-51f9b9aeb5b2", 1, 0, 0.0, 800.0, 800, 800, 800.0, 800.0, 800.0, 800.0, 1.25, 0.225830078125, 0.86181640625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ed420904-efd3-4326-9076-a81443113b48", 3, 0, 0.0, 663.3333333333334, 226, 1341, 423.0, 1341.0, 1341.0, 1341.0, 0.01923619482418118, 0.026518647487111753, 0.012335710873579729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1108.4375, 255, 1737, 1425.0, 1723.7, 1737.0, 1737.0, 0.07333696962474388, 54.87794157163418, 0.1532090940134115], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/66e9b200-73e7-4ed3-b4e0-3f177b044d0a", 1, 0, 0.0, 688.0, 688, 688, 688.0, 688.0, 688.0, 688.0, 1.4534883720930232, 0.46415107194767447, 0.8672669876453489], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 22, 0, 0.0, 512.5454545454546, 253, 1611, 497.5, 1099.6999999999996, 1555.499999999999, 1611.0, 0.12076167683077448, 13.304047197231265, 0.2687869318025876], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 0, 0.0, 1541.8, 1370, 1721, 1616.0, 1721.0, 1721.0, 1721.0, 0.056263221857136426, 67.31037360185894, 0.12686697194153126], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 1132.304347826087, 179, 2027, 1076.0, 1860.6000000000001, 1998.9999999999995, 2027.0, 0.0901140922768305, 0.028527966712637912, 0.04065694397646063], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3966b651-6d04-4984-abb4-b34f15a23dcb", 3, 0, 0.0, 327.3333333333333, 229, 522, 231.0, 522.0, 522.0, 522.0, 0.030733611301773326, 0.02562134718224007, 0.01970872860172313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 454.764705882353, 252, 1880, 259.0, 1378.3999999999996, 1880.0, 1880.0, 0.07569483405020794, 10.757315161285653, 0.16796095788473012], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 150.00000000000003, 126, 376, 133.5, 260.5, 376.0, 376.0, 0.0710421889113292, 0.05515482439893234, 0.02525327808957405], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5cf9589d-088b-493d-8948-5d6524eca3ca", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 504.6428571428572, 250, 1464, 386.5, 1113.0, 1464.0, 1464.0, 0.07768240105204166, 6.750018683657842, 0.1732898427486253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 127.54545454545453, 124, 130, 128.0, 130.0, 130.0, 130.0, 0.061503022034855435, 0.045706835711450185, 0.030871634107339545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 169.63636363636363, 122, 373, 126.0, 371.4, 373.0, 373.0, 0.061504741456432276, 0.016457323397521918, 0.03507692286187153], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 172.1818181818182, 125, 376, 128.0, 376.0, 376.0, 376.0, 0.061418545050502794, 0.016554217220643333, 0.036107386836330746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 172.0, 123, 377, 127.0, 375.6, 377.0, 377.0, 0.06141820212171971, 0.016554124790619767, 0.03616716394472362], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d2579633-a930-44bb-a88c-3df81cac6df2", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 4.761904761904763, 1.5206473214285714, 2.8413318452380953], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1442.535714285714, 983, 2385, 1373.5, 1904.6000000000004, 2098.7, 2385.0, 0.23638067419145145, 282.7934655517378, 0.4667594953272606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 1132.304347826087, 179, 2027, 1076.0, 1860.6000000000001, 1998.9999999999995, 2027.0, 0.09028813692392243, 0.028583065085970007, 0.04073546802622281], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 191.75, 124, 396, 126.0, 396.0, 396.0, 396.0, 0.03859662665483037, 0.010402997028059748, 0.02272828698521749], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 127.12499999999999, 125, 129, 127.0, 129.0, 129.0, 129.0, 0.038595695615046534, 0.010402746083743012, 0.022690047617439466], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/46362c14-41e2-4d51-b1f7-39cf8f7e8d3b", 3, 0, 0.0, 421.3333333333333, 222, 593, 449.0, 593.0, 593.0, 593.0, 0.0414696856597827, 0.026283033196483372, 0.02659351586906638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 216.42857142857142, 122, 1374, 127.5, 753.0, 1374.0, 1374.0, 0.0720197951551255, 4.646849206303275, 0.041897676589965585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 206.07142857142856, 125, 735, 128.0, 556.0, 735.0, 735.0, 0.0720197951551255, 1.5306115477311193, 0.041968008421171765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 189.5, 126, 385, 128.0, 385.0, 385.0, 385.0, 0.038595695615046534, 0.010327363865744874, 0.022011607655456226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 126.35714285714285, 118, 132, 127.0, 131.5, 132.0, 132.0, 0.07202275919190464, 0.05352472631351507, 0.03615204904749901], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 160.12500000000003, 123, 387, 128.0, 387.0, 387.0, 387.0, 0.03859495081555955, 0.028682380440078925, 0.019372856171091416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 177.21428571428572, 116, 381, 126.0, 375.5, 381.0, 381.0, 0.0720197951551255, 0.026997375778714035, 0.04064175103271242], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 194.0, 127, 383, 135.5, 383.0, 383.0, 383.0, 0.038041436634854514, 0.02994277141376244, 0.013522541928795942], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 552.6153846153846, 423, 1350, 462.0, 1087.9999999999998, 1350.0, 1350.0, 0.07249569208291276, 0.013097366245448107, 0.04934521228690449], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1249.1363636363637, 856, 1791, 1253.0, 1699.0, 1782.6, 1791.0, 0.08792297946998429, 0.04550701085848797, 0.04044113606480723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 354.625, 252, 784, 258.5, 784.0, 784.0, 784.0, 0.03857094643459814, 0.05977743358565161, 0.08674696253796828], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02dd3874-192e-49bb-b308-37b15f836410", 3, 0, 0.0, 489.3333333333333, 386, 632, 450.0, 632.0, 632.0, 632.0, 0.02744463045805088, 0.027525034648845953, 0.017599583985143306], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c435397-8119-43c7-be01-d23a74eb2c7b", 3, 0, 0.0, 440.3333333333333, 298, 529, 494.0, 529.0, 529.0, 529.0, 0.0280334532542167, 0.023370336518245105, 0.01797718193711162], "isController": false}, {"data": ["addBook", 57, 8, 14.035087719298245, 1267.1754385964912, 638, 2501, 1016.0, 2131.0, 2311.1999999999994, 2501.0, 0.2571703144245476, 87.37425760400734, 0.9331984951588816], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 224.0178571428571, 125, 523, 130.0, 508.90000000000003, 517.15, 523.0, 0.23787374850797938, 0.17677922130329327, 0.11498779835102518], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d425e6ee-9de5-4af2-b7c2-f2a1592ef6cd", 1, 0, 0.0, 774.0, 774, 774, 774.0, 774.0, 774.0, 774.0, 1.2919896640826873, 0.23341610142118863, 0.890766311369509], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 801.4285714285716, 608, 1142, 750.5, 1024.2, 1075.1, 1142.0, 0.23744408403824546, 69.81644459284699, 0.11941767898407853], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 194.41071428571433, 122, 520, 131.0, 381.90000000000003, 386.0, 520.0, 0.2383100413638143, 0.4216970653820621, 0.11589687558513627], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1215.839285714286, 852, 1868, 1223.5, 1489.6000000000001, 1581.5, 1868.0, 0.23693875133278047, 213.1979049431347, 0.11893214666508707], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 131.42857142857144, 127, 140, 130.5, 139.0, 140.0, 140.0, 0.08228420966016621, 0.06147209022463589, 0.02924946515263721], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 8, 4.705882352941177, 191.27058823529416, 119, 1026, 134.5, 321.6000000000001, 398.1499999999999, 766.1399999999971, 0.7125163983553445, 1.5769909987174704, 0.3411548816803651], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 177.27272727272728, 127, 379, 134.0, 378.4, 379.0, 379.0, 0.06381657954736641, 0.04942045662213043, 0.0226847997609779], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=10dc86ad-91fc-4eb4-99fa-fa5e69633e15", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/336e9bfc-8baa-4e00-a9f2-cb848a8ecdd7", 3, 0, 0.0, 412.3333333333333, 234, 575, 428.0, 575.0, 575.0, 575.0, 0.09024727754046086, 0.04083454289753926, 0.05787341691233982], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 22, 0, 0.0, 147.1818181818182, 127, 379, 133.5, 159.29999999999998, 346.44999999999953, 379.0, 0.1183705752271908, 0.09606049610722223, 0.04207704041279048], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1aa05f0f-b8e6-4e7f-9fdd-07e0e423c499", 3, 0, 0.0, 358.6666666666667, 223, 521, 332.0, 521.0, 521.0, 521.0, 0.03348102184078658, 0.027911750304119284, 0.021470577157014833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f1d93de5-d47b-41fc-a1bb-50896801f5f6", 1, 0, 0.0, 539.0, 539, 539, 539.0, 539.0, 539.0, 539.0, 1.8552875695732838, 0.5924599953617811, 1.1070124072356216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 323.6363636363636, 252, 506, 257.0, 505.4, 506.0, 506.0, 0.0613736539641801, 0.09511717660268929, 0.13803078621045584], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a4e47ec5-91b6-41b0-9b0a-be98276e468e", 3, 0, 0.0, 391.33333333333337, 238, 695, 241.0, 695.0, 695.0, 695.0, 0.06487468373591679, 0.02935410494561339, 0.041602580390545596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 396.92857142857144, 249, 1500, 259.0, 1003.5, 1500.0, 1500.0, 0.07197573389542954, 6.2541520599840625, 0.16055970772710915], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ed420904-efd3-4326-9076-a81443113b48", 1, 0, 0.0, 609.0, 609, 609, 609.0, 609.0, 609.0, 609.0, 1.6420361247947455, 0.29665691707717573, 1.1321069376026274], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/55327cb1-aba2-4be6-b435-10d66c8ba788", 3, 0, 0.0, 396.6666666666667, 316, 462, 412.0, 462.0, 462.0, 462.0, 0.032706459525756335, 0.02726602957209049, 0.02097386890160807], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 132.1818181818182, 126, 140, 132.0, 139.2, 140.0, 140.0, 0.06796248470844095, 0.05634780226315073, 0.024158539486203615], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 148.62499999999997, 119, 374, 131.5, 217.20000000000016, 374.0, 374.0, 0.0706127420693064, 0.054821415962010345, 0.02510062315744876], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=46362c14-41e2-4d51-b1f7-39cf8f7e8d3b", 1, 0, 0.0, 716.0, 716, 716, 716.0, 716.0, 716.0, 716.0, 1.3966480446927374, 0.2523241096368715, 0.9629233589385475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 181.0714285714286, 124, 380, 128.0, 380.0, 380.0, 380.0, 0.0777376133442166, 0.057771800541942225, 0.039020637948171226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 197.49999999999997, 122, 384, 127.0, 380.5, 384.0, 384.0, 0.07773890832361596, 0.02914124534954745, 0.04386912446554501], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 302.7857142857143, 124, 1333, 132.5, 857.0, 1333.0, 1333.0, 0.0777376133442166, 5.0157733174665315, 0.045224030084456364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 226.71428571428572, 124, 1000, 127.0, 692.5, 1000.0, 1000.0, 0.07773631840796019, 1.6521028194685057, 0.04529919112584399], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 38.46153846153846, 0.3878975950349108], "isController": false}, {"data": ["401/Unauthorized", 8, 61.53846153846154, 0.6206361520558572], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1289, 13, "401/Unauthorized", 8, "406/Not Acceptable", 5, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
