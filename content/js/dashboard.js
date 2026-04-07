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

    var data = {"OkPercent": 97.90732436472346, "KoPercent": 2.092675635276532};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8184159690920798, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4298245614035088, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d42ac219-c933-4e2a-918c-eb1bccc4b930"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/20383e07-f836-4607-b543-4fdb2e9675ef"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1981ddeb-c396-4cfa-8bca-937740c54305"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/406367fa-75f3-452f-a043-58bf74b62b70"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5205deb5-0a6b-4b80-a385-016e622e042a"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f38b83bf-b191-48c3-8ca7-ba58aec2d449"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/91970f0d-b240-4599-a932-8700d617f855"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=27a9dba9-bebd-4a6b-bef0-a7ff3749409a"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f52f4eee-8f22-4fd8-acf0-3cc83b04ff88"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b3ce0102-04b3-442a-8ab4-9989f75d7568"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b4ac921b-f8a6-4ff0-a4c2-ca8327ca8f24"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1981ddeb-c396-4cfa-8bca-937740c54305"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5ec595be-abe8-4aa5-9f14-d55379f64204"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/601c3d7c-88ed-4aee-9588-fb5d7efc1f65"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/176c020f-9dec-4ff9-b54b-1b9cfa94de96"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=601c3d7c-88ed-4aee-9588-fb5d7efc1f65"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=406367fa-75f3-452f-a043-58bf74b62b70"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d42ac219-c933-4e2a-918c-eb1bccc4b930"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b3ce0102-04b3-442a-8ab4-9989f75d7568"], "isController": false}, {"data": [0.4523809523809524, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3467741935483871, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b4ac921b-f8a6-4ff0-a4c2-ca8327ca8f24"], "isController": false}, {"data": [0.9824561403508771, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/50987e08-6e5c-4755-a192-3a401eff93ea"], "isController": false}, {"data": [0.7807017543859649, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f38b83bf-b191-48c3-8ca7-ba58aec2d449"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9116022099447514, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=20383e07-f836-4607-b543-4fdb2e9675ef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5ec595be-abe8-4aa5-9f14-d55379f64204"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2f815b51-56cf-487e-9149-cf6f51895a25"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/27a9dba9-bebd-4a6b-bef0-a7ff3749409a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f52f4eee-8f22-4fd8-acf0-3cc83b04ff88"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1338, 28, 2.092675635276532, 290.80343796711514, 78, 5291, 90.0, 796.1000000000001, 977.05, 1335.689999999997, 5.224623674808177, 713.4525960214959, 3.823395004783381], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1383.859649122807, 968, 5650, 1295.0, 1624.2, 1665.8999999999992, 5650.0, 0.2539269581332359, 305.5594559740215, 1.2485568693367606], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d42ac219-c933-4e2a-918c-eb1bccc4b930", 3, 0, 0.0, 325.0, 276, 419, 280.0, 419.0, 419.0, 419.0, 0.06567713122290818, 0.029717191536407023, 0.042117170738648804], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/20383e07-f836-4607-b543-4fdb2e9675ef", 3, 0, 0.0, 336.3333333333333, 287, 427, 295.0, 427.0, 427.0, 427.0, 0.03385507769740331, 0.033954262495344924, 0.021710450216108245], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 590.5384615384617, 84, 2128, 471.0, 1605.5999999999995, 2128.0, 2128.0, 0.0716182417170749, 0.014197756902896682, 0.048150786010202846], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 590.5384615384617, 84, 2128, 471.0, 1605.5999999999995, 2128.0, 2128.0, 0.0714207229974728, 0.014158600359850565, 0.04801798909460499], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 22, 0, 0.0, 110.54545454545455, 79, 245, 81.0, 242.4, 244.7, 245.0, 0.10836797824759128, 0.02899690042953126, 0.0618036125943294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1981ddeb-c396-4cfa-8bca-937740c54305", 3, 0, 0.0, 537.0, 174, 1032, 405.0, 1032.0, 1032.0, 1032.0, 0.029795602169119837, 0.02988289397234968, 0.019107205818087915], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/406367fa-75f3-452f-a043-58bf74b62b70", 3, 0, 0.0, 306.0, 248, 404, 266.0, 404.0, 404.0, 404.0, 0.027855153203342618, 0.027936760097493036, 0.017862842386258123], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 22, 0, 0.0, 97.50000000000001, 80, 244, 83.0, 196.7999999999999, 243.85, 244.0, 0.10836797824759128, 0.08053518695939156, 0.054395645331310465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 22, 0, 0.0, 110.81818181818183, 79, 244, 82.0, 242.8, 244.0, 244.0, 0.10836851205107113, 0.029208700513765264, 0.06381466090507411], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 22, 0, 0.0, 96.31818181818183, 80, 244, 81.5, 194.59999999999988, 243.7, 244.0, 0.10836851205107113, 0.029208700513765264, 0.06370883228002423], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 203.38461538461536, 81, 287, 209.0, 282.6, 287.0, 287.0, 0.07145487624565088, 0.1367046866154024, 0.046183725602282164], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 94.26666666666667, 81, 236, 83.0, 149.00000000000006, 236.0, 236.0, 0.07786423591825294, 0.05786590188846727, 0.039084196544904304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 103.40000000000002, 81, 244, 82.0, 241.6, 244.0, 244.0, 0.0778650443052102, 0.03642826877455994, 0.04353548180293915], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 562.4, 472, 737, 483.0, 737.0, 737.0, 737.0, 0.0516219620475335, 15.17857085243346, 0.02944065023023395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 758.0, 552, 919, 732.0, 919.0, 919.0, 919.0, 0.051474221709767745, 46.316595176479375, 0.029306124274213474], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 147.8, 81, 248, 84.0, 248.0, 248.0, 248.0, 0.05192161912377076, 0.09187692759010996, 0.028749568401541033], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 93.4, 80, 243, 82.0, 151.80000000000007, 243.0, 243.0, 0.09453940402359703, 0.07025828756050523, 0.04745434928528211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 124.06666666666668, 79, 244, 82.0, 242.8, 244.0, 244.0, 0.0946360298292766, 0.025322531419161902, 0.05397211076200931], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 114.0, 80, 244, 82.0, 243.4, 244.0, 244.0, 0.0946360298292766, 0.025507367414922207, 0.055635634723852065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 103.46666666666665, 79, 248, 82.0, 243.8, 248.0, 248.0, 0.09463543276783405, 0.025507206488205272, 0.05572770113183978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 82.4, 80, 84, 82.0, 84.0, 84.0, 84.0, 0.051922697487979896, 0.03858708280112569, 0.02915581157772309], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 686.9285714285716, 80, 1127, 871.5, 1082.5, 1127.0, 1127.0, 0.07362724628839792, 47.32704540763199, 0.03876523821043719], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 214.06666666666666, 81, 933, 82.0, 908.4, 933.0, 933.0, 0.0778650443052102, 9.359935952756683, 0.044883925929578856], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5205deb5-0a6b-4b80-a385-016e622e042a", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.698765727571116, 1.3056448304157549], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 470.8571428571429, 79, 733, 638.0, 731.0, 733.0, 733.0, 0.07362724628839792, 15.46913785781527, 0.0388371398181407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 167.46666666666664, 81, 638, 83.0, 544.4000000000001, 638.0, 638.0, 0.0778650443052102, 3.0708432394973033, 0.044959966011908166], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 342.3076923076923, 83, 626, 373.0, 600.4, 626.0, 626.0, 0.07163560620254142, 0.014201199276480378, 0.04860372560256566], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f38b83bf-b191-48c3-8ca7-ba58aec2d449", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 0.9508634868421052, 3.6287006578947367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 241.13333333333335, 164, 487, 167.0, 394.00000000000006, 487.0, 487.0, 0.09448997461369349, 0.14644100557805814, 0.21251016751497664], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/91970f0d-b240-4599-a932-8700d617f855", 1, 0, 0.0, 186.0, 186, 186, 186.0, 186.0, 186.0, 186.0, 5.376344086021506, 1.716859879032258, 3.207955309139785], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=27a9dba9-bebd-4a6b-bef0-a7ff3749409a", 1, 0, 0.0, 562.0, 562, 562, 562.0, 562.0, 562.0, 562.0, 1.779359430604982, 0.3214663033807829, 1.2267849199288254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 448.0952380952381, 140, 941, 384.0, 892.4000000000001, 940.2, 941.0, 0.09643467239764147, 0.059235750916129384, 0.04360278644541797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 82.4285714285714, 81, 85, 82.0, 84.5, 85.0, 85.0, 0.07362531027809331, 0.054715684689090834, 0.03695645457318356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 140.7857142857143, 79, 256, 82.5, 254.0, 256.0, 256.0, 0.07362840794345338, 0.09869164948670481, 0.03757431867426792], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f52f4eee-8f22-4fd8-acf0-3cc83b04ff88", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 0.4856560819892473, 1.8533686155913978], "isController": false}, {"data": ["login", 21, 0, 0.0, 2127.6190476190473, 1469, 2960, 2105.0, 2827.8, 2950.0, 2960.0, 0.09401062767762412, 26.907704891406535, 0.17895856789357997], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b3ce0102-04b3-442a-8ab4-9989f75d7568", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 0.7590926995798319, 2.8968618697478994], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 96.26666666666667, 82, 247, 84.0, 155.20000000000005, 247.0, 247.0, 0.0774049724954331, 0.06266476777218169, 0.027515048816735988], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b4ac921b-f8a6-4ff0-a4c2-ca8327ca8f24", 3, 0, 0.0, 354.0, 262, 451, 349.0, 451.0, 451.0, 451.0, 0.0191020751220941, 0.026333752650412927, 0.012249703121915811], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1981ddeb-c396-4cfa-8bca-937740c54305", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 0.4843540549597855, 1.848399798927614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ec595be-abe8-4aa5-9f14-d55379f64204", 3, 0, 0.0, 316.0, 187, 418, 343.0, 418.0, 418.0, 418.0, 0.02833530106257379, 0.0236219746162928, 0.018170749704840613], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 770.7142857142857, 163, 1209, 955.0, 1165.5, 1209.0, 1209.0, 0.07359357422963297, 62.92080165086157, 0.152063954787262], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/601c3d7c-88ed-4aee-9588-fb5d7efc1f65", 3, 0, 0.0, 380.3333333333333, 176, 523, 442.0, 523.0, 523.0, 523.0, 0.028136518387214766, 0.028218949593427307, 0.018043275137634467], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 22, 0, 0.0, 231.5909090909091, 162, 487, 167.0, 438.89999999999986, 486.85, 487.0, 0.10832422425083951, 0.16788139051375225, 0.24362371918914394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 503.8888888888889, 81, 1002, 633.0, 1002.0, 1002.0, 1002.0, 0.07033283058384064, 46.754207026640515, 0.10881899211100084], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/176c020f-9dec-4ff9-b54b-1b9cfa94de96", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 1.2981135670731707, 2.42552718495935], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 872.3913043478261, 119, 2178, 866.0, 1503.2000000000003, 2054.3999999999983, 2178.0, 0.09140113973247284, 0.02865599591476645, 0.04123762359023677], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=601c3d7c-88ed-4aee-9588-fb5d7efc1f65", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=406367fa-75f3-452f-a043-58bf74b62b70", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 0.4632411858974359, 1.7678285256410255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 87.125, 81, 110, 85.0, 98.10000000000001, 110.0, 110.0, 0.09783299907058651, 0.07595433033312135, 0.03477657388837255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 320.3333333333333, 165, 1170, 169.0, 1054.2, 1170.0, 1170.0, 0.07783110649889739, 12.519614857633934, 0.17238880691399663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 22, 0, 0.0, 231.8636363636364, 164, 481, 168.5, 329.7, 458.3499999999997, 481.0, 0.12121145338042215, 0.18785407862766595, 0.272607399546008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 83.00000000000001, 80, 91, 82.0, 91.0, 91.0, 91.0, 0.03581918475535497, 0.02661953085822767, 0.017979551722902786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 81.5, 80, 83, 81.5, 83.0, 83.0, 83.0, 0.035820948986491026, 0.00958490236552592, 0.020429134968858162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 131.25, 80, 321, 82.0, 321.0, 321.0, 321.0, 0.03579578504631079, 0.009648082688263457, 0.02104400644324131], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 83.375, 80, 88, 82.0, 88.0, 88.0, 88.0, 0.035820948986491026, 0.009654865156515159, 0.021093781483255945], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 83.5, 83, 84, 83.5, 84.0, 84.0, 84.0, 0.09223815892634782, 0.02720305077710649, 0.05701831503943181], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 984.631578947368, 635, 5291, 874.0, 1282.0, 1325.0999999999992, 5291.0, 0.2341381661641596, 280.1106463291654, 0.4623314179530574], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 872.3913043478261, 119, 2178, 866.0, 1503.2000000000003, 2054.3999999999983, 2178.0, 0.09343440498533485, 0.029293463247779917, 0.042154975686742875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 106.57142857142857, 81, 245, 83.0, 245.0, 245.0, 245.0, 0.042152423162154354, 0.011361395305424415, 0.02482217887380769], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 82.42857142857143, 80, 90, 81.0, 90.0, 90.0, 90.0, 0.042152930833062346, 0.011361532138598836, 0.024781312853030795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d42ac219-c933-4e2a-918c-eb1bccc4b930", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 0.9217554209183673, 3.5176179846938775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 190.125, 78, 717, 81.0, 716.3, 717.0, 717.0, 0.09241663730513086, 10.416377112586568, 0.05333811781966049], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 182.49999999999997, 80, 646, 82.0, 527.7000000000002, 646.0, 646.0, 0.0924177049218204, 3.4185300025414866, 0.05342898565792741], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 106.57142857142857, 82, 244, 83.0, 244.0, 244.0, 244.0, 0.042152169331285946, 0.011278998434347997, 0.024039909071749015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 113.12500000000001, 81, 254, 82.5, 249.1, 254.0, 254.0, 0.09241663730513086, 0.06868072362227011, 0.046388819897302015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 84.71428571428571, 83, 90, 84.0, 90.0, 90.0, 90.0, 0.04215140785702243, 0.031325411503119203, 0.02115803089698196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 142.4375, 80, 252, 82.0, 247.8, 252.0, 252.0, 0.09241663730513086, 0.04207935267921608, 0.051736169272623304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 108.28571428571428, 84, 246, 85.0, 246.0, 246.0, 246.0, 0.04369156253510929, 0.03439003847978329, 0.01553098511990213], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 393.53846153846155, 82, 680, 414.0, 617.1999999999999, 680.0, 680.0, 0.07143799182309755, 0.013861503371323691, 0.04861454085978371], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b3ce0102-04b3-442a-8ab4-9989f75d7568", 3, 0, 0.0, 323.6666666666667, 193, 399, 379.0, 399.0, 399.0, 399.0, 0.0809301572742723, 0.0366187886104292, 0.05189857090830613], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1188.0, 697, 1981, 1117.0, 1632.8000000000002, 1949.8999999999996, 1981.0, 0.095493176785154, 0.04942517939075353, 0.043923131118952664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 193.57142857142856, 166, 329, 169.0, 329.0, 329.0, 329.0, 0.04213035130694368, 0.06529381594152307, 0.0947521475194251], "isController": false}, {"data": ["addBook", 62, 13, 20.967741935483872, 877.7903225806452, 414, 2844, 693.5, 1527.1000000000001, 1570.8, 2844.0, 0.3019676602376778, 82.72921727364601, 1.0999550625243522], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b4ac921b-f8a6-4ff0-a4c2-ca8327ca8f24", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 0.45507320528967254, 1.7366577455919394], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 213.17543859649123, 81, 4131, 84.0, 330.2, 333.5, 4131.0, 0.23467509850178478, 0.17440209957017402, 0.11344157593592134], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50987e08-6e5c-4755-a192-3a401eff93ea", 1, 0, 0.0, 165.0, 165, 165, 165.0, 165.0, 165.0, 165.0, 6.0606060606060606, 1.9353693181818181, 3.6162405303030303], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 532.2280701754386, 396, 753, 484.0, 645.4, 656.7999999999995, 753.0, 0.23836606336355426, 70.08753712708257, 0.11988136975803754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f38b83bf-b191-48c3-8ca7-ba58aec2d449", 3, 0, 0.0, 293.6666666666667, 209, 409, 263.0, 409.0, 409.0, 409.0, 0.06249088674568293, 0.028275498885579186, 0.04007390849251151], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 140.54385964912277, 80, 340, 86.0, 244.4, 256.3999999999995, 340.0, 0.23868447169076543, 0.42235963154654976, 0.11607897158398553], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 766.7894736842104, 551, 1127, 782.0, 970.2, 1114.6, 1127.0, 0.2382126528531189, 214.34416377041524, 0.1195715855141632], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 22, 0, 0.0, 100.00000000000001, 83, 246, 86.0, 197.0999999999999, 245.54999999999998, 246.0, 0.12112869924294563, 0.09049165519614591, 0.04305746730901583], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 13, 7.18232044198895, 154.54696132596678, 82, 1547, 88.0, 251.60000000000002, 332.10000000000014, 1183.740000000003, 0.7440353848430538, 1.5572861643331635, 0.35847729535943895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 105.25, 81, 246, 85.0, 246.0, 246.0, 246.0, 0.03536474311934717, 0.027386954388322563, 0.012571061030705438], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=20383e07-f836-4607-b543-4fdb2e9675ef", 1, 0, 0.0, 626.0, 626, 626, 626.0, 626.0, 626.0, 626.0, 1.5974440894568689, 0.2886007388178914, 1.1013628194888179], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 22, 0, 0.0, 85.18181818181817, 83, 89, 85.0, 88.0, 88.85, 89.0, 0.10249577204940297, 0.08317772126274792, 0.03643404397068621], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 216.125, 162, 404, 165.5, 404.0, 404.0, 404.0, 0.03578089568527124, 0.0554533998559819, 0.08047207301091765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 336.125, 163, 798, 246.0, 797.3, 798.0, 798.0, 0.09237181966711505, 13.93886473951147, 0.20479211288991012], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5ec595be-abe8-4aa5-9f14-d55379f64204", 1, 0, 0.0, 538.0, 538, 538, 538.0, 538.0, 538.0, 538.0, 1.858736059479554, 0.3358068076208178, 1.2815113847583641], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 108.8, 83, 246, 86.0, 244.8, 246.0, 246.0, 0.09720125195212515, 0.08058970987046314, 0.03455200752985699], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 85.14285714285712, 82, 91, 84.5, 90.5, 91.0, 91.0, 0.0741902662370697, 0.05759888833835001, 0.026372321201458368], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2f815b51-56cf-487e-9149-cf6f51895a25", 1, 0, 0.0, 166.0, 166, 166, 166.0, 166.0, 166.0, 166.0, 6.024096385542169, 1.9237104668674698, 3.5944559487951806], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/27a9dba9-bebd-4a6b-bef0-a7ff3749409a", 3, 0, 0.0, 567.6666666666666, 235, 1054, 414.0, 1054.0, 1054.0, 1054.0, 0.019544865238154182, 0.023101369036372995, 0.012533653814831947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f52f4eee-8f22-4fd8-acf0-3cc83b04ff88", 3, 0, 0.0, 369.33333333333337, 211, 680, 217.0, 680.0, 680.0, 680.0, 0.020864485168828457, 0.02466111511979692, 0.013379894460479188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 22, 0, 0.0, 89.86363636363636, 80, 240, 83.0, 85.7, 216.89999999999966, 240.0, 0.12126690846553263, 0.09012120834206087, 0.06087030366336306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 22, 0, 0.0, 118.00000000000001, 80, 242, 82.0, 241.7, 242.0, 242.0, 0.12126824535873351, 0.03244872971512987, 0.06916079618115271], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 22, 0, 0.0, 110.45454545454545, 80, 243, 82.0, 240.0, 242.54999999999998, 243.0, 0.1212675769084485, 0.03268540158860526, 0.07129207158094335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 22, 0, 0.0, 126.0, 79, 247, 82.0, 244.8, 246.85, 247.0, 0.12126958228141158, 0.03268594209928671, 0.07141167784735468], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 25.0, 0.523168908819133], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 7.142857142857143, 0.14947683109118087], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.142857142857143, 0.14947683109118087], "isController": false}, {"data": ["401/Unauthorized", 17, 60.714285714285715, 1.2705530642750373], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1338, 28, "401/Unauthorized", 17, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
