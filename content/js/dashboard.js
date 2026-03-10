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

    var data = {"OkPercent": 98.75679875679876, "KoPercent": 1.2432012432012431};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7875250166777852, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.08035714285714286, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e73613fa-c955-4ec4-a2b2-d8d43dbd4853"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e2f3d095-72d9-45fd-9c4b-0dda870810ff"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ce9a16bf-5e85-4b57-a1b7-a0350a8334be"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=51d70de0-9c7c-43c4-8fa7-58e4892453f6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e647a336-52b6-4add-b87f-d451c9c14f21"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5de16ebf-fdde-45f8-821a-8f0b15dbd6b4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4859eddb-f14f-4517-a9b1-fab979a77757"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e6dac7bd-be44-46d3-b3fe-9583a21a892d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=27ca0656-c2d5-4dd9-a6f8-78623e282f7f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=272298b9-4774-4dc2-ae56-8f72455ab1cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4ea53836-5f6c-47e0-8fad-c501ec8613da"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0a94ca8d-76aa-4e88-8897-c813aa86ab8b"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e73613fa-c955-4ec4-a2b2-d8d43dbd4853"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/80b6629f-1cf4-452f-b9b7-e34c23271a94"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "register"], "isController": true}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e2f3d095-72d9-45fd-9c4b-0dda870810ff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/51d70de0-9c7c-43c4-8fa7-58e4892453f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.41964285714285715, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4859eddb-f14f-4517-a9b1-fab979a77757"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d8f11046-cb28-4fa9-9226-b5c7905cad24"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e647a336-52b6-4add-b87f-d451c9c14f21"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c7b691c5-754d-46a9-825d-af55a2a3f3e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.425, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e6dac7bd-be44-46d3-b3fe-9583a21a892d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ce9a16bf-5e85-4b57-a1b7-a0350a8334be"], "isController": false}, {"data": [0.34210526315789475, 500, 1500, "addBook"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.961764705882353, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5de16ebf-fdde-45f8-821a-8f0b15dbd6b4"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c7b691c5-754d-46a9-825d-af55a2a3f3e6"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0a94ca8d-76aa-4e88-8897-c813aa86ab8b"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4ea53836-5f6c-47e0-8fad-c501ec8613da"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/27ca0656-c2d5-4dd9-a6f8-78623e282f7f"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/272298b9-4774-4dc2-ae56-8f72455ab1cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1287, 16, 1.2432012432012431, 377.9642579642583, 117, 2091, 136.0, 989.0, 1188.1999999999998, 1585.7199999999993, 5.066390580528842, 709.7054474647381, 3.7075060549665984], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1791.892857142857, 1456, 2237, 1761.5, 2108.0, 2142.0499999999997, 2237.0, 0.25711071830306925, 309.3907690150019, 1.2642113932187047], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e73613fa-c955-4ec4-a2b2-d8d43dbd4853", 3, 0, 0.0, 408.0, 364, 462, 398.0, 462.0, 462.0, 462.0, 0.017191287455517543, 0.023699577595741143, 0.011024360770628112], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 465.6428571428571, 126, 797, 453.5, 718.0, 797.0, 797.0, 0.09458436925737758, 0.01785992519389796, 0.06396452706126365], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 465.6428571428571, 126, 797, 453.5, 718.0, 797.0, 797.0, 0.09377784029633797, 0.017707632092786477, 0.06341909609884185], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e2f3d095-72d9-45fd-9c4b-0dda870810ff", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ce9a16bf-5e85-4b57-a1b7-a0350a8334be", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.3577506188118812, 1.3652537128712872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 139.4666666666667, 119, 379, 123.0, 227.8000000000001, 379.0, 379.0, 0.10295056313958037, 0.0378557799877832, 0.05813757712713022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 125.06666666666665, 119, 142, 124.0, 134.20000000000002, 142.0, 142.0, 0.10294632378677757, 0.076506008204822, 0.05167422893203484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 237.0666666666666, 117, 836, 124.0, 636.8000000000002, 836.0, 836.0, 0.10294067185945167, 2.0437610446762515, 0.06002861965137426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 236.33333333333331, 117, 1111, 125.0, 665.2000000000003, 1111.0, 1111.0, 0.10294773686558457, 6.201401429686695, 0.05993220462578497], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=51d70de0-9c7c-43c4-8fa7-58e4892453f6", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.44608410493827155, 1.7023533950617282], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e647a336-52b6-4add-b87f-d451c9c14f21", 1, 0, 0.0, 576.0, 576, 576, 576.0, 576.0, 576.0, 576.0, 1.736111111111111, 0.31365288628472227, 1.196967230902778], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 233.07142857142858, 121, 364, 213.0, 354.0, 364.0, 364.0, 0.09394396913269586, 0.20668852751216238, 0.060726755158530446], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 123.87499999999999, 118, 127, 124.5, 127.0, 127.0, 127.0, 0.11984659635666346, 0.08906568342521573, 0.060157373561840845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 139.3125, 120, 367, 124.5, 201.10000000000016, 367.0, 367.0, 0.11984480098272737, 0.0433179267223945, 0.06771991989124085], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 647.2, 596, 829, 601.0, 829.0, 829.0, 829.0, 0.06820165866433872, 20.053552155513422, 0.03889625845700567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5de16ebf-fdde-45f8-821a-8f0b15dbd6b4", 3, 0, 0.0, 326.0, 206, 561, 211.0, 561.0, 561.0, 561.0, 0.06493506493506493, 0.029381425865800864, 0.0416413014069264], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1046.2, 864, 1126, 1068.0, 1126.0, 1126.0, 1126.0, 0.06776536918573133, 60.97539831213406, 0.03858125999539195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 320.4, 117, 386, 367.0, 386.0, 386.0, 386.0, 0.06840881105486386, 0.12105152893692707, 0.03787870690244903], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 177.33333333333331, 118, 421, 126.0, 391.0, 421.0, 421.0, 0.09047808620752054, 0.06724006211320618, 0.04541575811588433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 172.26666666666668, 117, 374, 124.0, 371.0, 374.0, 374.0, 0.09047917772523283, 0.02421024872725957, 0.051601406046421855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4859eddb-f14f-4517-a9b1-fab979a77757", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 0.7655256885593221, 2.9214115466101696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 216.86666666666667, 118, 362, 124.0, 361.4, 362.0, 362.0, 0.0904879108151151, 0.02438931971188649, 0.05319699444404227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 191.33333333333331, 121, 380, 126.0, 377.6, 380.0, 380.0, 0.09061254077564335, 0.024422911380935122, 0.05335875203878217], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 171.0, 119, 369, 122.0, 369.0, 369.0, 369.0, 0.06864831468387451, 0.05101696042424659, 0.038547637639870944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 213.25, 119, 814, 126.0, 505.3000000000003, 814.0, 814.0, 0.11984659635666346, 6.770169632089676, 0.06981298313159157], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 694.3125000000001, 119, 1225, 855.5, 1151.5, 1225.0, 1225.0, 0.0758283057586859, 42.6516910452695, 0.04050594067382929], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 195.06249999999997, 118, 809, 124.0, 496.8000000000003, 809.0, 809.0, 0.119843903315931, 2.2326632451856456, 0.0699284494445984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 537.6875, 121, 878, 615.0, 852.8000000000001, 878.0, 878.0, 0.07581177830740729, 13.939650122720316, 0.04057114698482343], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 534.0714285714286, 126, 1367, 454.5, 1122.0, 1367.0, 1367.0, 0.0939691915293486, 0.017743764053428195, 0.06430885449877503], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 434.33333333333337, 248, 781, 487.0, 763.6, 781.0, 781.0, 0.090276607525458, 0.13991110951455257, 0.20303420618274393], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 641.8000000000001, 153, 1625, 633.0, 1278.6000000000008, 1609.4499999999998, 1625.0, 0.09349770229396612, 0.05743169408486787, 0.04227484000205695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 124.25000000000001, 119, 127, 124.5, 127.0, 127.0, 127.0, 0.07582722766177266, 0.05635207055723534, 0.03806171388491322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 247.87499999999997, 120, 377, 263.0, 374.9, 377.0, 377.0, 0.07580998227941664, 0.09144949278383731, 0.039256096780918626], "isController": false}, {"data": ["login", 20, 0, 0.0, 2579.4, 1701, 3953, 2409.0, 3576.3, 3934.6, 3953.0, 0.08998956121089954, 27.038106255455617, 0.17308050859850257], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e6dac7bd-be44-46d3-b3fe-9583a21a892d", 1, 0, 0.0, 702.0, 702, 702, 702.0, 702.0, 702.0, 702.0, 1.4245014245014245, 0.2573562143874644, 0.9821269586894588], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=27ca0656-c2d5-4dd9-a6f8-78623e282f7f", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 144.75, 122, 374, 130.5, 207.40000000000018, 374.0, 374.0, 0.11727625888734149, 0.09494337755625595, 0.04168804515135967], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=272298b9-4774-4dc2-ae56-8f72455ab1cf", 1, 0, 0.0, 1367.0, 1367, 1367, 1367.0, 1367.0, 1367.0, 1367.0, 0.731528895391368, 0.13216098207754207, 0.5043548829553768], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4ea53836-5f6c-47e0-8fad-c501ec8613da", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0a94ca8d-76aa-4e88-8897-c813aa86ab8b", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 825.875, 244, 1350, 994.0, 1277.9, 1350.0, 1350.0, 0.0757647504498532, 56.69464622892793, 0.15828099843735202], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e73613fa-c955-4ec4-a2b2-d8d43dbd4853", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.34543797801147225, 1.3182660133843211], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/80b6629f-1cf4-452f-b9b7-e34c23271a94", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.7585176662707839, 1.417291419239905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 414.99999999999994, 243, 1233, 262.0, 871.8000000000002, 1233.0, 1233.0, 0.10285103056732628, 8.351811699476144, 0.2295600182903416], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 904.1428571428571, 120, 1490, 1174.0, 1490.0, 1490.0, 1490.0, 0.07522756337922214, 64.29026488162405, 0.13540541611589343], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1140.9999999999998, 189, 2091, 1104.0, 1643.8000000000002, 2010.199999999999, 2091.0, 0.09171348706640454, 0.028894109800981733, 0.04137854592253799], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 368.3125, 248, 932, 254.0, 630.3000000000003, 932.0, 932.0, 0.11973269675449558, 9.126585347430611, 0.2673669704260239], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 143.25, 119, 380, 128.0, 209.20000000000016, 380.0, 380.0, 0.08551759524522169, 0.06639305490229615, 0.030398832684824902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 399.1666666666666, 245, 744, 484.0, 528.0000000000003, 744.0, 744.0, 0.13461567225570997, 0.20862799987286298, 0.3027538019579102], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e2f3d095-72d9-45fd-9c4b-0dda870810ff", 3, 0, 0.0, 354.6666666666667, 216, 515, 333.0, 515.0, 515.0, 515.0, 0.0425260472039124, 0.02734015079027571, 0.027270935218654757], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/51d70de0-9c7c-43c4-8fa7-58e4892453f6", 3, 0, 0.0, 357.0, 229, 445, 397.0, 445.0, 445.0, 445.0, 0.050448147712176504, 0.04205654501656381, 0.032351188474279854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 125.25, 121, 132, 125.5, 132.0, 132.0, 132.0, 0.048998891400082074, 0.036414215190881304, 0.024595146659806822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 153.375, 120, 360, 124.5, 360.0, 360.0, 360.0, 0.04899919151334003, 0.013111111791655437, 0.027944851409951735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 183.0, 117, 375, 121.0, 375.0, 375.0, 375.0, 0.04892667115161152, 0.013187266833832794, 0.02876353128249037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 124.75, 120, 127, 124.5, 127.0, 127.0, 127.0, 0.048998591290500396, 0.013206651558767685, 0.028853662644698963], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 126.0, 126, 126, 126.0, 126.0, 126.0, 126.0, 7.936507936507936, 2.3406498015873014, 4.906063988095238], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1174.0714285714287, 944, 1721, 998.0, 1595.8000000000002, 1630.3, 1721.0, 0.2463292542381828, 294.69542597366035, 0.4864040547554742], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1140.9999999999998, 189, 2091, 1104.0, 1643.8000000000002, 2010.199999999999, 2091.0, 0.09133290446578193, 0.02877420818342824, 0.041206837757022705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 179.0, 120, 373, 126.0, 373.0, 373.0, 373.0, 0.04186942322543428, 0.011285117978730332, 0.024655529497008662], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 177.11111111111114, 120, 372, 124.0, 372.0, 372.0, 372.0, 0.041871565950042565, 0.01128569550997241, 0.024615901076099244], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4859eddb-f14f-4517-a9b1-fab979a77757", 3, 0, 0.0, 345.0, 197, 476, 362.0, 476.0, 476.0, 476.0, 0.05435570372517756, 0.024594540422525003, 0.03485701052688796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d8f11046-cb28-4fa9-9226-b5c7905cad24", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 1.5134404620853081, 2.827865817535545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 260.68749999999994, 120, 1163, 124.5, 1081.1000000000001, 1163.0, 1163.0, 0.08447818878763239, 9.52162616883494, 0.048756454661612054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 217.31250000000003, 120, 866, 126.0, 858.3, 866.0, 866.0, 0.08458358444084964, 3.1287459624554614, 0.048899884754866195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e647a336-52b6-4add-b87f-d451c9c14f21", 3, 0, 0.0, 599.3333333333334, 328, 960, 510.0, 960.0, 960.0, 960.0, 0.022881375323199428, 0.022948410602466614, 0.014673277795150675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 149.33333333333334, 117, 368, 123.0, 368.0, 368.0, 368.0, 0.04191915192897964, 0.011216648074746505, 0.0239070163344962], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 125.6875, 120, 129, 126.0, 128.3, 129.0, 129.0, 0.08458134875533259, 0.06285781875274228, 0.04245587232445405], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c7b691c5-754d-46a9-825d-af55a2a3f3e6", 3, 0, 0.0, 354.0, 213, 466, 383.0, 466.0, 466.0, 466.0, 0.01653976987666845, 0.02280140801682646, 0.010606558156587514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 124.33333333333333, 118, 127, 126.0, 127.0, 127.0, 127.0, 0.041917980484851305, 0.031151936668917815, 0.021040861298060126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 139.93750000000003, 119, 377, 124.0, 205.50000000000017, 377.0, 377.0, 0.08458447874814971, 0.03851319650031719, 0.04735161371325862], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 129.44444444444446, 126, 137, 128.0, 137.0, 137.0, 137.0, 0.0422557033461822, 0.03325986025099888, 0.015020582048838202], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 471.21428571428567, 120, 656, 481.5, 608.5, 656.0, 656.0, 0.0938186886827856, 0.0175321056767008, 0.06385246550487858], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1275.2, 829, 1688, 1240.5, 1673.1, 1687.3, 1688.0, 0.0919777046044039, 0.04760564789095124, 0.04230615123893968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 332.44444444444446, 243, 501, 254.0, 501.0, 501.0, 501.0, 0.0418454785960377, 0.06485231887882015, 0.09411146211589339], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e6dac7bd-be44-46d3-b3fe-9583a21a892d", 3, 0, 0.0, 294.6666666666667, 214, 428, 242.0, 428.0, 428.0, 428.0, 0.02067325913930331, 0.024435092426696066, 0.013257265789201667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ce9a16bf-5e85-4b57-a1b7-a0350a8334be", 3, 0, 0.0, 346.3333333333333, 213, 487, 339.0, 487.0, 487.0, 487.0, 0.0253908068352052, 0.025465193964605216, 0.016282516102003333], "isController": false}, {"data": ["addBook", 57, 6, 10.526315789473685, 1115.0526315789477, 642, 2166, 980.0, 1725.4, 1942.8999999999996, 2166.0, 0.2668989155475642, 79.42756346604531, 0.9719532259650503], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 219.35714285714283, 121, 509, 127.0, 494.6, 506.3, 509.0, 0.24725371763625448, 0.18375007726678677, 0.1195220607714316], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 712.3928571428573, 589, 1003, 621.5, 920.0000000000002, 970.05, 1003.0, 0.24717186831035962, 72.67673616168571, 0.1243100704881203], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 187.1785714285715, 120, 378, 127.5, 371.90000000000003, 377.15, 378.0, 0.24768568686337036, 0.4382875630824484, 0.12045651568160005], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 949.0892857142857, 817, 1244, 866.5, 1116.6, 1200.15, 1244.0, 0.2468939854861607, 222.15564213378127, 0.12392920755848301], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 141.8888888888889, 123, 374, 128.5, 160.70000000000033, 374.0, 374.0, 0.12805645866977797, 0.09566717859607436, 0.04552006929277264], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 6, 3.5294117647058822, 182.06470588235297, 118, 888, 130.5, 303.5, 376.45, 601.8699999999968, 0.7061061568303311, 1.5070182603724918, 0.3390226257699672], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 129.62499999999997, 126, 136, 129.5, 136.0, 136.0, 136.0, 0.0500006250078126, 0.03872118713983925, 0.017773659670745887], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 145.93333333333334, 123, 379, 128.0, 237.4000000000001, 379.0, 379.0, 0.10844732352005552, 0.08800754477067006, 0.038549634532519736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 312.125, 246, 501, 251.5, 501.0, 501.0, 501.0, 0.04888899753110563, 0.07576839754088342, 0.10995250128333618], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5de16ebf-fdde-45f8-821a-8f0b15dbd6b4", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.4143671158256881, 1.581314506880734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 405.18749999999994, 247, 1287, 254.0, 1207.9, 1287.0, 1287.0, 0.08442068940045482, 12.739042870540874, 0.18716413096814702], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c7b691c5-754d-46a9-825d-af55a2a3f3e6", 1, 0, 0.0, 877.0, 877, 877, 877.0, 877.0, 877.0, 877.0, 1.1402508551881414, 0.20600235176738882, 0.7861495153933865], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a94ca8d-76aa-4e88-8897-c813aa86ab8b", 3, 0, 0.0, 362.6666666666667, 197, 530, 361.0, 530.0, 530.0, 530.0, 0.03937369574632841, 0.032003944752142584, 0.02524940775399315], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4ea53836-5f6c-47e0-8fad-c501ec8613da", 3, 0, 0.0, 592.3333333333334, 344, 902, 531.0, 902.0, 902.0, 902.0, 0.019270545613381467, 0.026566002823134933, 0.012357739211706215], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 147.53333333333333, 124, 406, 130.0, 242.8000000000001, 406.0, 406.0, 0.08776395007986519, 0.07276522814238823, 0.03119734162995208], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/27ca0656-c2d5-4dd9-a6f8-78623e282f7f", 3, 0, 0.0, 725.6666666666666, 211, 1310, 656.0, 1310.0, 1310.0, 1310.0, 0.024378748232540756, 0.024450170346503274, 0.01563350716735198], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 152.1875, 124, 512, 128.0, 248.10000000000025, 512.0, 512.0, 0.07386717758131162, 0.05734805290736594, 0.026257473280856862], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/272298b9-4774-4dc2-ae56-8f72455ab1cf", 3, 0, 0.0, 316.6666666666667, 210, 458, 282.0, 458.0, 458.0, 458.0, 0.03785154623566373, 0.031185632657052372, 0.02427328974096925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 138.16666666666669, 119, 379, 124.0, 153.10000000000036, 379.0, 379.0, 0.13497806606426455, 0.10031084792471225, 0.06775266206741405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 176.44444444444446, 117, 372, 124.5, 371.1, 372.0, 372.0, 0.13498413936362477, 0.036118802915657416, 0.07698314198081727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 191.05555555555554, 118, 379, 122.0, 376.3, 379.0, 379.0, 0.13497907824287236, 0.036381079682649184, 0.07935293467012612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 217.27777777777777, 120, 377, 127.0, 367.1, 377.0, 377.0, 0.13473961569267393, 0.03631653704216601, 0.07934373853777574], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 37.5, 0.4662004662004662], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.25, 0.0777000777000777], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.25, 0.0777000777000777], "isController": false}, {"data": ["401/Unauthorized", 8, 50.0, 0.6216006216006216], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1287, 16, "401/Unauthorized", 8, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
