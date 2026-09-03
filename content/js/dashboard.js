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

    var data = {"OkPercent": 98.3529411764706, "KoPercent": 1.6470588235294117};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7174932975871313, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=92d45abb-da2f-45e7-b2bf-982599369073"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5f663b99-41c6-4013-9661-05606719f977"], "isController": false}, {"data": [0.84375, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6d9085d0-d73e-4627-9bd8-6aaa722cf191"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=26f47e05-5152-43d1-82d2-68d0a78f2b9b"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d9fb1e26-ad38-4edc-a372-95e1aaa6731c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6d9085d0-d73e-4627-9bd8-6aaa722cf191"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5f651b0c-34ec-4daa-8dec-0578515393b0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=31feee9b-f527-473a-a916-274d952b0d08"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/139498f8-0d6c-478e-b9c6-e26eb154e226"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3102a31d-147e-4a0a-babc-6393c4fa16c9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ebb412ad-a768-47c2-8984-7742e9fd1636"], "isController": false}, {"data": [0.36666666666666664, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.1111111111111111, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=65e88e90-7d17-4796-88f9-235e85707977"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd62ec44-fda4-4e72-a83e-24aa82e99307"], "isController": false}, {"data": [0.1875, 500, 1500, "register"], "isController": true}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.24074074074074073, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.1875, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5f663b99-41c6-4013-9661-05606719f977"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d9fb1e26-ad38-4edc-a372-95e1aaa6731c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1d73e5b7-14aa-4333-9045-041834c390f0"], "isController": false}, {"data": [0.25892857142857145, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d7627eff-75c8-4b9e-bf47-6780fb341719"], "isController": false}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/92d45abb-da2f-45e7-b2bf-982599369073"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3425925925925926, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9126506024096386, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f05c4920-f67f-4270-a5eb-fc176c78a7d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=139498f8-0d6c-478e-b9c6-e26eb154e226"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f05c4920-f67f-4270-a5eb-fc176c78a7d8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/26f47e05-5152-43d1-82d2-68d0a78f2b9b"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1d73e5b7-14aa-4333-9045-041834c390f0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/31feee9b-f527-473a-a916-274d952b0d08"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5f651b0c-34ec-4daa-8dec-0578515393b0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ebb412ad-a768-47c2-8984-7742e9fd1636"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3102a31d-147e-4a0a-babc-6393c4fa16c9"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/fd62ec44-fda4-4e72-a83e-24aa82e99307"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/65e88e90-7d17-4796-88f9-235e85707977"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1275, 21, 1.6470588235294117, 504.03450980392176, 140, 4537, 167.0, 1411.8000000000002, 1700.4, 2292.8, 4.9274410156325485, 705.9715973181678, 3.599413386939383], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=92d45abb-da2f-45e7-b2bf-982599369073", 1, 0, 0.0, 948.0, 948, 948, 948.0, 948.0, 948.0, 948.0, 1.0548523206751055, 0.1905739055907173, 0.7272712289029536], "isController": false}, {"data": ["see books", 54, 0, 0.0, 2363.6481481481483, 1763, 3190, 2342.0, 2756.0, 2942.25, 3190.0, 0.24345599307502952, 292.96010734746807, 1.1970712159499743], "isController": true}, {"data": ["deleteBook", 15, 1, 6.666666666666667, 593.0, 155, 969, 580.0, 868.8000000000001, 969.0, 969.0, 0.08818860603210066, 0.01660426097948145, 0.059659362322887884], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, 6.666666666666667, 593.0, 155, 969, 580.0, 868.8000000000001, 969.0, 969.0, 0.08992751842015335, 0.0169316655775445, 0.06083573202498786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 219.42105263157896, 141, 432, 145.0, 432.0, 432.0, 432.0, 0.08335197785469557, 0.028892153508021528, 0.04716823993524867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 147.0, 142, 156, 146.0, 155.0, 156.0, 156.0, 0.08334649330596058, 0.061940118560386725, 0.0418360327727185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 257.6842105263157, 142, 838, 146.0, 447.0, 838.0, 838.0, 0.08335234351694246, 1.3111971398082019, 0.04870645525514591], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 251.00000000000006, 141, 1577, 146.0, 437.0, 1577.0, 1577.0, 0.08335270918239766, 3.9687002694156974, 0.04862526979955867], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f663b99-41c6-4013-9661-05606719f977", 3, 0, 0.0, 558.0, 238, 1151, 285.0, 1151.0, 1151.0, 1151.0, 0.022059958968476318, 0.022124587754516777, 0.014146523166633578], "isController": false}, {"data": ["goToProfile", 16, 1, 6.25, 345.125, 146, 1003, 268.0, 736.3000000000003, 1003.0, 1003.0, 0.08641081863449303, 0.16694101820297902, 0.05585796998034154], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6d9085d0-d73e-4627-9bd8-6aaa722cf191", 3, 0, 0.0, 607.3333333333334, 273, 1089, 460.0, 1089.0, 1089.0, 1089.0, 0.04513925460044236, 0.029020191352823462, 0.028946722513955553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 175.3684210526316, 143, 431, 146.0, 425.0, 431.0, 431.0, 0.10950061954297899, 0.08137692526582717, 0.05496417816903438], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 204.94736842105266, 142, 434, 146.0, 427.0, 434.0, 434.0, 0.10949998847368542, 0.02929980160331036, 0.06244921217639872], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 1043.142857142857, 714, 1281, 1155.0, 1281.0, 1281.0, 1281.0, 0.11788679499486351, 34.66263193847993, 0.06723231277050809], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=26f47e05-5152-43d1-82d2-68d0a78f2b9b", 1, 0, 0.0, 301.0, 301, 301, 301.0, 301.0, 301.0, 301.0, 3.3222591362126246, 0.6002128322259136, 2.290541943521595], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1478.0, 1039, 1705, 1675.0, 1705.0, 1705.0, 1705.0, 0.117096018735363, 105.36320349092506, 0.06666697160421546], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 266.57142857142856, 140, 436, 149.0, 436.0, 436.0, 436.0, 0.12018198987037514, 0.21266578676281228, 0.06654608228174093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 149.1, 143, 181, 145.0, 177.9, 181.0, 181.0, 0.056603987184857305, 0.04206604906999649, 0.028412548254899077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 173.2, 143, 426, 145.5, 398.2000000000001, 426.0, 426.0, 0.056605589235881146, 0.015146417432257262, 0.03228287511108847], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 143.10000000000002, 141, 145, 143.0, 144.9, 145.0, 145.0, 0.05660623008168279, 0.015257147951703565, 0.033278271981614295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 172.79999999999998, 142, 427, 143.5, 399.2000000000001, 427.0, 427.0, 0.056604307587807434, 0.015256629779526222, 0.03333241940961707], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d9fb1e26-ad38-4edc-a372-95e1aaa6731c", 3, 0, 0.0, 384.0, 333, 464, 355.0, 464.0, 464.0, 464.0, 0.030697760086772333, 0.02559145949942186, 0.019685738076478353], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 184.0, 142, 424, 143.0, 424.0, 424.0, 424.0, 0.12016754789535122, 0.08930420307457254, 0.06747689457014351], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 189.73684210526315, 142, 431, 145.0, 428.0, 431.0, 431.0, 0.10950125061954655, 0.029514008956049654, 0.06437475866500686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 1091.6666666666665, 143, 1903, 1429.0, 1796.2, 1903.0, 1903.0, 0.11117864184171126, 66.7024802796884, 0.05899127155012674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 175.10526315789477, 142, 438, 145.0, 426.0, 438.0, 438.0, 0.10949998847368542, 0.029513668768298026, 0.06448095024378156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 783.8000000000001, 143, 1258, 1128.0, 1230.4, 1258.0, 1258.0, 0.11117452176426554, 21.802655496097774, 0.05909765431023621], "isController": false}, {"data": ["deleteBooks", 15, 1, 6.666666666666667, 753.7333333333333, 148, 2941, 527.0, 1795.0000000000007, 2941.0, 2941.0, 0.08995771987166032, 0.016937351944586045, 0.061594097649104916], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 323.7, 288, 571, 293.5, 546.5000000000001, 571.0, 571.0, 0.056556927375249554, 0.08765219115675885, 0.1271978552199216], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 642.909090909091, 274, 1269, 549.0, 1133.6, 1249.0499999999997, 1269.0, 0.09325669328721367, 0.0572836524195873, 0.0421658681562304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 152.46666666666667, 144, 198, 147.0, 184.8, 198.0, 198.0, 0.11117946589384584, 0.08262458354025067, 0.05580688034124684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 269.8666666666667, 141, 582, 148.0, 495.6, 582.0, 582.0, 0.1111720498643701, 0.14106401379274566, 0.05717833293805494], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6d9085d0-d73e-4627-9bd8-6aaa722cf191", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.34281605787476277, 1.3082601992409866], "isController": false}, {"data": ["login", 22, 0, 0.0, 3355.681818181818, 2015, 5378, 3378.0, 5133.099999999999, 5364.8, 5378.0, 0.09479163076074593, 36.210937331691, 0.19303359609286133], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 151.26315789473685, 146, 160, 150.0, 157.0, 160.0, 160.0, 0.10710983832051774, 0.08671294528096601, 0.038074200340496536], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f651b0c-34ec-4daa-8dec-0578515393b0", 3, 0, 0.0, 432.33333333333337, 260, 771, 266.0, 771.0, 771.0, 771.0, 0.018943818947607712, 0.02239095266886836, 0.012148217228771872], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=31feee9b-f527-473a-a916-274d952b0d08", 1, 0, 0.0, 1007.0, 1007, 1007, 1007.0, 1007.0, 1007.0, 1007.0, 0.9930486593843098, 0.1794082050645482, 0.684660501489573], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/139498f8-0d6c-478e-b9c6-e26eb154e226", 3, 0, 0.0, 444.33333333333337, 263, 800, 270.0, 800.0, 800.0, 800.0, 0.04329879052045146, 0.02693489214992928, 0.027766476993909304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3102a31d-147e-4a0a-babc-6393c4fa16c9", 1, 0, 0.0, 2941.0, 2941, 2941, 2941.0, 2941.0, 2941.0, 2941.0, 0.34002040122407345, 0.061429467018021086, 0.23442812818769126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ebb412ad-a768-47c2-8984-7742e9fd1636", 3, 0, 0.0, 443.33333333333337, 253, 801, 276.0, 801.0, 801.0, 801.0, 0.02198639774859287, 0.025987177807662992, 0.014099350118726548], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1246.5333333333335, 290, 2050, 1585.0, 1961.2, 2050.0, 2050.0, 0.1110494169905608, 88.62650813205627, 0.23081071858226912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 490.1578947368421, 288, 1719, 305.0, 603.0, 1719.0, 1719.0, 0.08329351318887022, 5.3669260775550285, 0.1862074093415867], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, 22.22222222222222, 1328.3333333333333, 144, 1849, 1705.0, 1849.0, 1849.0, 1849.0, 0.1486104919007282, 138.28980284341407, 0.2825147372071135], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=65e88e90-7d17-4796-88f9-235e85707977", 1, 0, 0.0, 600.0, 600, 600, 600.0, 600.0, 600.0, 600.0, 1.6666666666666667, 0.30110677083333337, 1.1490885416666667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd62ec44-fda4-4e72-a83e-24aa82e99307", 1, 0, 0.0, 610.0, 610, 610, 610.0, 610.0, 610.0, 610.0, 1.639344262295082, 0.2961705942622951, 1.130251024590164], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 1242.3749999999998, 220, 2699, 1214.0, 2119.5, 2576.25, 2699.0, 0.09403025423429989, 0.029384454448218716, 0.04242380610961577], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 427.1578947368421, 290, 865, 296.0, 853.0, 865.0, 865.0, 0.10940730034607256, 0.16955994692306361, 0.24605958271191905], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 172.72222222222217, 146, 443, 150.5, 259.4000000000003, 443.0, 443.0, 0.11295109844943242, 0.08769152662822147, 0.04015058577694668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 689.076923076923, 291, 1822, 576.0, 1724.0, 1822.0, 1822.0, 0.08147609616686305, 15.102805059430544, 0.18003450786871067], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 146.30769230769232, 142, 160, 146.0, 154.79999999999998, 160.0, 160.0, 0.06241477981986134, 0.046384421330971176, 0.03132929377676634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 189.0769230769231, 143, 435, 144.0, 433.4, 435.0, 435.0, 0.062415978490493566, 0.016701150494526598, 0.03559661273285961], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 209.8461538461538, 141, 436, 144.0, 434.0, 436.0, 436.0, 0.062415678818519206, 0.016822975931554005, 0.03669359243041852], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 166.9230769230769, 142, 435, 145.0, 320.19999999999993, 435.0, 435.0, 0.062415978490493566, 0.016823056702515844, 0.03675472170875744], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 148.0, 148, 148, 148.0, 148.0, 148.0, 148.0, 6.756756756756757, 1.9927153716216217, 4.176784206081082], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1640.1296296296302, 1139, 2583, 1545.5, 2169.0, 2338.25, 2583.0, 0.24399390918908173, 291.90154139763325, 0.4817926605276594], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 1242.3749999999998, 220, 2699, 1214.0, 2119.5, 2576.25, 2699.0, 0.09354755723941159, 0.029233611637316123, 0.042206026801375154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 3, 0, 0.0, 246.66666666666666, 147, 433, 160.0, 433.0, 433.0, 433.0, 0.033737053405755536, 0.009093190175770049, 0.019866643753584563], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 3, 0, 0.0, 241.33333333333334, 144, 434, 146.0, 434.0, 434.0, 434.0, 0.03373743280627966, 0.009093292436067565, 0.019833920458379256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 342.05555555555554, 140, 1714, 146.0, 1318.0000000000007, 1714.0, 1714.0, 0.1055303780918935, 10.57599662082935, 0.06103265139212157], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 286.00000000000006, 140, 1137, 146.0, 877.8000000000004, 1137.0, 1137.0, 0.10570762445604619, 3.4788314976421324, 0.06123839051332797], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5f663b99-41c6-4013-9661-05606719f977", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 176.94444444444446, 142, 428, 145.0, 427.1, 428.0, 428.0, 0.10570576213854502, 0.07855672362053981, 0.05305933763594936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 3, 0, 0.0, 145.0, 143, 147, 145.0, 147.0, 147.0, 147.0, 0.033737053405755536, 0.009027297493336932, 0.019240663270469957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 207.77777777777777, 142, 433, 145.0, 429.4, 433.0, 433.0, 0.10570886603750315, 0.04592646480188397, 0.05930065510133369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 3, 0, 0.0, 145.66666666666666, 145, 146, 146.0, 146.0, 146.0, 146.0, 0.033737053405755536, 0.02507216566580075, 0.016934419385310887], "isController": false}, {"data": ["deleteAccount", 15, 1, 6.666666666666667, 797.1999999999999, 144, 3123, 600.0, 1939.8000000000006, 3123.0, 3123.0, 0.08766905516136951, 0.016346625910297022, 0.05966746762089562], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 3, 0, 0.0, 150.33333333333334, 147, 154, 150.0, 154.0, 154.0, 154.0, 0.03680259090239953, 0.028967664323568378, 0.013082170984837332], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1896.090909090909, 1031, 4537, 1642.5, 2728.7999999999997, 4278.5499999999965, 4537.0, 0.09337305932584651, 0.0483278529713854, 0.042947959904759477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 0, 0.0, 393.3333333333333, 293, 580, 307.0, 580.0, 580.0, 580.0, 0.03368137420006736, 0.05219955161670597, 0.07575019998315932], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d9fb1e26-ad38-4edc-a372-95e1aaa6731c", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.35355002446183953, 1.349223336594912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1d73e5b7-14aa-4333-9045-041834c390f0", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["addBook", 56, 9, 16.071428571428573, 1486.8392857142856, 736, 3332, 1173.5, 2599.2, 2695.1499999999996, 3332.0, 0.25604096655464875, 83.08866472206982, 0.9294388887936356], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d7627eff-75c8-4b9e-bf47-6780fb341719", 2, 0, 0.0, 280.5, 266, 295, 280.5, 295.0, 295.0, 295.0, 0.02039671612870328, 0.028662963387894546, 0.01267823224210902], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 263.79629629629625, 144, 586, 148.0, 580.5, 582.25, 586.0, 0.24541884816753926, 0.18238646821825916, 0.11863508773723822], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/92d45abb-da2f-45e7-b2bf-982599369073", 3, 0, 0.0, 1523.6666666666665, 445, 3123, 1003.0, 3123.0, 3123.0, 3123.0, 0.02972916728602432, 0.024783983534996185, 0.019064602719227833], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 935.685185185185, 703, 1303, 858.0, 1232.0, 1273.5, 1303.0, 0.24531181857828172, 72.12981978099107, 0.12337459625763193], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 224.57407407407408, 141, 580, 148.0, 436.5, 441.25, 580.0, 0.2459385973301999, 0.43519603355695524, 0.11960685690472611], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1370.5555555555552, 992, 2000, 1300.0, 1693.5, 1754.5, 2000.0, 0.24466716204215525, 220.15194248452707, 0.12281144657194121], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 176.6153846153846, 147, 442, 150.0, 337.19999999999993, 442.0, 442.0, 0.07777585000029914, 0.058104028564676606, 0.027646884179793836], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 9, 5.421686746987952, 239.24698795180726, 143, 2728, 152.0, 406.1000000000004, 514.0, 2023.160000000013, 0.6722307938397742, 1.502292506955159, 0.32200117615079027], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 170.0, 144, 431, 147.0, 320.5999999999999, 431.0, 431.0, 0.06156556495877475, 0.047677239269832396, 0.02188463441893946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f05c4920-f67f-4270-a5eb-fc176c78a7d8", 3, 0, 0.0, 539.6666666666666, 247, 840, 532.0, 840.0, 840.0, 840.0, 0.01789111467608137, 0.02114669185835008, 0.011473143200481867], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 153.0, 142, 167, 151.0, 167.0, 167.0, 167.0, 0.07917260461201256, 0.06425042425056879, 0.028143386795676344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=139498f8-0d6c-478e-b9c6-e26eb154e226", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f05c4920-f67f-4270-a5eb-fc176c78a7d8", 1, 0, 0.0, 1031.0, 1031, 1031, 1031.0, 1031.0, 1031.0, 1031.0, 0.9699321047526673, 0.17523187439379245, 0.6687227206595538], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/26f47e05-5152-43d1-82d2-68d0a78f2b9b", 3, 0, 0.0, 380.3333333333333, 246, 535, 360.0, 535.0, 535.0, 535.0, 0.0714847380084352, 0.03234498236709796, 0.04584144982962804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 359.3076923076923, 287, 591, 292.0, 587.4, 591.0, 591.0, 0.06237165831846009, 0.09666388842909782, 0.1402753213939586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 567.6111111111111, 286, 1859, 299.0, 1717.7000000000003, 1859.0, 1859.0, 0.10543827174957239, 14.160899901005177, 0.23413565878417955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1d73e5b7-14aa-4333-9045-041834c390f0", 3, 0, 0.0, 629.3333333333334, 511, 808, 569.0, 808.0, 808.0, 808.0, 0.041187857819514805, 0.0267479740722435, 0.02641278642722792], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/31feee9b-f527-473a-a916-274d952b0d08", 3, 0, 0.0, 392.3333333333333, 284, 578, 315.0, 578.0, 578.0, 578.0, 0.0274992208554091, 0.02292496894879645, 0.017634591499074193], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5f651b0c-34ec-4daa-8dec-0578515393b0", 1, 0, 0.0, 524.0, 524, 524, 524.0, 524.0, 524.0, 524.0, 1.9083969465648853, 0.34477874522900764, 1.3157502385496183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 149.20000000000002, 143, 159, 148.5, 158.5, 159.0, 159.0, 0.05801709183525467, 0.048102061492315634, 0.02062326311331318], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 192.59999999999997, 146, 452, 150.0, 438.8, 452.0, 452.0, 0.10522033137389694, 0.08168961273657038, 0.03740253966806493], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ebb412ad-a768-47c2-8984-7742e9fd1636", 1, 0, 0.0, 696.0, 696, 696, 696.0, 696.0, 696.0, 696.0, 1.4367816091954022, 0.25957480244252873, 0.9905935704022989], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3102a31d-147e-4a0a-babc-6393c4fa16c9", 3, 0, 0.0, 419.66666666666663, 247, 687, 325.0, 687.0, 687.0, 687.0, 0.028705936387644966, 0.023930958036705325, 0.018408429259004096], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd62ec44-fda4-4e72-a83e-24aa82e99307", 3, 0, 0.0, 554.0, 440, 622, 600.0, 622.0, 622.0, 622.0, 0.026647480480720548, 0.026725549271191407, 0.017088390803066237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 171.3076923076923, 144, 425, 146.0, 328.19999999999993, 425.0, 425.0, 0.0816967792615868, 0.0607141103692066, 0.04100795365278869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 254.6153846153846, 142, 439, 146.0, 435.8, 439.0, 439.0, 0.08155020669840851, 0.04066483413942576, 0.04545541869758047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 471.1538461538462, 142, 1430, 428.0, 1416.4, 1430.0, 1430.0, 0.0816978060996839, 11.328144638895697, 0.04694923502573481], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 430.0, 142, 1148, 429.0, 1140.0, 1148.0, 1148.0, 0.0816978060996839, 3.7143043431810616, 0.04702901803950404], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/65e88e90-7d17-4796-88f9-235e85707977", 3, 0, 0.0, 335.3333333333333, 245, 504, 257.0, 504.0, 504.0, 504.0, 0.1013273887931908, 0.047035435032255886, 0.06497882679771676], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 38.095238095238095, 0.6274509803921569], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.761904761904762, 0.0784313725490196], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.761904761904762, 0.0784313725490196], "isController": false}, {"data": ["401/Unauthorized", 11, 52.38095238095238, 0.8627450980392157], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1275, 21, "401/Unauthorized", 11, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
