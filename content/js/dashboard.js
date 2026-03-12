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

    var data = {"OkPercent": 97.24702380952381, "KoPercent": 2.7529761904761907};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8035031847133758, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.46551724137931033, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dbd412af-c322-4fca-8a43-7111dce8f521"], "isController": false}, {"data": [0.65625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.65625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4916e3df-ae67-4d9a-9237-b1ca5803812e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2bc944fb-682e-4929-b77e-99a3cf8e9548"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c5db7a53-b33e-4d5c-99b4-fb253e749a1b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c6f900d-f5b0-4d4b-b139-bf8e0ca5fc41"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ff14100-c781-4f80-acff-45ac5ba80be7"], "isController": false}, {"data": [0.782608695652174, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=12ac0d54-05a0-4c68-a4c8-2db96e71fcc1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7751c529-7d81-47ae-ab36-0e71259c0679"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.06521739130434782, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab49530d-1ef5-48f6-9c89-786f8e47dfa9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/90f08379-2a2e-4520-aeed-d27f03b19187"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.23333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c0e18523-be70-4c64-9bcd-0818c5597598"], "isController": false}, {"data": [0.32, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f7702199-77c8-4b9b-ab84-21a3e9ead11b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c5db7a53-b33e-4d5c-99b4-fb253e749a1b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8f20a996-52e3-4cf5-8340-10e0e3083a6d"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.32, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.45652173913043476, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2bc944fb-682e-4929-b77e-99a3cf8e9548"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0ff14100-c781-4f80-acff-45ac5ba80be7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dbd412af-c322-4fca-8a43-7111dce8f521"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6c6f900d-f5b0-4d4b-b139-bf8e0ca5fc41"], "isController": false}, {"data": [0.3448275862068966, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fc4cb4c1-a3f7-44a6-a91f-354e772b1963"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8103448275862069, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5e0131c2-8acb-4bc7-98b3-724771ddcb73"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9080459770114943, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5e0131c2-8acb-4bc7-98b3-724771ddcb73"], "isController": false}, {"data": [0.8809523809523809, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/12ac0d54-05a0-4c68-a4c8-2db96e71fcc1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1d1d5643-ccab-4f93-8046-c99db8052e4d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7751c529-7d81-47ae-ab36-0e71259c0679"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f7702199-77c8-4b9b-ab84-21a3e9ead11b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ab49530d-1ef5-48f6-9c89-786f8e47dfa9"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c0e18523-be70-4c64-9bcd-0818c5597598"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1344, 37, 2.7529761904761907, 286.4791666666666, 82, 2436, 100.0, 698.0, 861.0, 1404.299999999998, 5.285990159562962, 756.2799747462705, 3.8619304544712634], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1256.5, 1014, 1688, 1225.0, 1484.7, 1535.1, 1688.0, 0.26219666558171495, 315.51006557600766, 1.2892189562538425], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/dbd412af-c322-4fca-8a43-7111dce8f521", 3, 0, 0.0, 583.6666666666666, 297, 1053, 401.0, 1053.0, 1053.0, 1053.0, 0.09890870726319607, 0.04475361428901124, 0.06342778428010946], "isController": false}, {"data": ["deleteBook", 16, 4, 25.0, 370.5625, 92, 771, 384.5, 645.7000000000002, 771.0, 771.0, 0.08075669018705268, 0.016896602414625036, 0.05392322940956765], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, 25.0, 370.5625, 92, 771, 384.5, 645.7000000000002, 771.0, 771.0, 0.08104056080068074, 0.016955996241743994, 0.054112776804165486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 130.1875, 85, 263, 87.5, 260.9, 263.0, 263.0, 0.10379298489163363, 0.02777273228545666, 0.05919443669600981], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4916e3df-ae67-4d9a-9237-b1ca5803812e", 1, 0, 0.0, 166.0, 166, 166, 166.0, 166.0, 166.0, 166.0, 6.024096385542169, 1.9237104668674698, 3.5944559487951806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 109.625, 84, 265, 88.0, 261.5, 265.0, 265.0, 0.10379231158451938, 0.07713471593341724, 0.052098875150823204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 109.125, 83, 262, 86.0, 258.5, 262.0, 262.0, 0.10379500486539085, 0.027975997405124877, 0.061121472591631525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 142.68749999999997, 82, 265, 88.5, 262.2, 265.0, 265.0, 0.10379163828614058, 0.027975090006811327, 0.06101813110181311], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2bc944fb-682e-4929-b77e-99a3cf8e9548", 1, 0, 0.0, 753.0, 753, 753, 753.0, 753.0, 753.0, 753.0, 1.3280212483399734, 0.23992571381142097, 0.9156083997343958], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 192.75, 86, 347, 176.5, 326.70000000000005, 347.0, 347.0, 0.08105739370082729, 0.13074363667796404, 0.05238254910304928], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c5db7a53-b33e-4d5c-99b4-fb253e749a1b", 3, 0, 0.0, 790.0, 184, 1633, 553.0, 1633.0, 1633.0, 1633.0, 0.078538143358291, 0.03553646460547673, 0.05036462969265407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 12, 0, 0.0, 88.0, 85, 90, 88.0, 90.0, 90.0, 90.0, 0.16633630428454596, 0.12361516363333934, 0.08349302773657874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 12, 0, 0.0, 100.25000000000001, 85, 249, 86.5, 201.00000000000017, 249.0, 249.0, 0.16634322151372333, 0.06532978410036042, 0.0937034325616856], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 537.8571428571429, 408, 708, 585.0, 708.0, 708.0, 708.0, 0.051497094092547636, 15.141855527661296, 0.02936943647465607], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 663.0000000000001, 579, 761, 612.0, 761.0, 761.0, 761.0, 0.05137614678899082, 46.228347190366975, 0.029250286697247708], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 174.28571428571428, 85, 352, 90.0, 352.0, 352.0, 352.0, 0.05156233886769104, 0.0912411699494689, 0.028550630994121893], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 100.13333333333334, 85, 259, 89.0, 161.20000000000005, 259.0, 259.0, 0.07178098186812398, 0.05334504609535386, 0.03603068816427317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 131.2, 84, 259, 86.0, 257.2, 259.0, 259.0, 0.07172366307092036, 0.01919168328264861, 0.04090490159513427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 120.39999999999999, 84, 262, 87.0, 258.4, 262.0, 262.0, 0.07178235589692053, 0.019347588112841863, 0.04220017407221305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 97.73333333333333, 84, 261, 87.0, 157.80000000000007, 261.0, 261.0, 0.07178201238478987, 0.019347495525587895, 0.04227007174612138], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 87.57142857142857, 83, 92, 87.0, 92.0, 92.0, 92.0, 0.05162546462918166, 0.0383661900222727, 0.028988908361112748], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 522.1999999999999, 84, 850, 599.0, 808.0, 850.0, 850.0, 0.07722763101667601, 46.333310513640974, 0.04097690057199932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 12, 0, 0.0, 185.58333333333334, 83, 761, 89.0, 610.1000000000006, 761.0, 761.0, 0.16480120854219596, 12.398085580752593, 0.09570486850236902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 417.33333333333337, 85, 710, 437.0, 646.4000000000001, 710.0, 710.0, 0.07722842623913011, 15.145419517682734, 0.04105274090120425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 12, 0, 0.0, 143.83333333333334, 85, 569, 87.5, 476.00000000000034, 569.0, 569.0, 0.1652369084174435, 4.089586589303664, 0.09611925629621469], "isController": false}, {"data": ["deleteBooks", 15, 4, 26.666666666666668, 434.5333333333335, 87, 1593, 355.0, 1089.0000000000002, 1593.0, 1593.0, 0.08606444505645827, 0.018171028341021755, 0.057701279634857244], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c6f900d-f5b0-4d4b-b139-bf8e0ca5fc41", 1, 0, 0.0, 745.0, 745, 745, 745.0, 745.0, 745.0, 745.0, 1.3422818791946307, 0.24250209731543623, 0.9254404362416108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 245.2, 173, 516, 178.0, 417.6, 516.0, 516.0, 0.07169281064494852, 0.11110985399759112, 0.16123881144073873], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ff14100-c781-4f80-acff-45ac5ba80be7", 1, 0, 0.0, 366.0, 366, 366, 366.0, 366.0, 366.0, 366.0, 2.73224043715847, 0.49361765710382516, 1.8837517076502732], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 505.5652173913044, 119, 1498, 491.0, 1093.4000000000005, 1441.7999999999993, 1498.0, 0.11056735474814679, 0.06791686146150813, 0.04999285668788278], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 100.8, 85, 251, 90.0, 164.00000000000006, 251.0, 251.0, 0.07721967969276863, 0.05738689086542669, 0.03876065953328425], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=12ac0d54-05a0-4c68-a4c8-2db96e71fcc1", 1, 0, 0.0, 737.0, 737, 737, 737.0, 737.0, 737.0, 737.0, 1.3568521031207597, 0.2451344131614654, 0.9354859226594301], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7751c529-7d81-47ae-ab36-0e71259c0679", 3, 0, 0.0, 552.0, 168, 1070, 418.0, 1070.0, 1070.0, 1070.0, 0.01930887113903031, 0.022822432000592138, 0.012382316453089098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 173.0, 84, 348, 89.0, 300.6, 348.0, 348.0, 0.07722842623913011, 0.09799362157556286, 0.039720349432885924], "isController": false}, {"data": ["login", 23, 0, 0.0, 2189.3913043478265, 1213, 3655, 2068.0, 3509.6, 3627.5999999999995, 3655.0, 0.10924445584386593, 39.924456011591786, 0.21995929605010045], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab49530d-1ef5-48f6-9c89-786f8e47dfa9", 1, 0, 0.0, 355.0, 355, 355, 355.0, 355.0, 355.0, 355.0, 2.8169014084507045, 0.5089128521126761, 1.9421214788732395], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 12, 0, 0.0, 106.58333333333333, 87, 262, 93.0, 213.40000000000018, 262.0, 262.0, 0.1591153188273201, 0.12881503838657066, 0.05656052348939894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/90f08379-2a2e-4520-aeed-d27f03b19187", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 1.3250453838174274, 2.4758493257261414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 644.1333333333334, 175, 938, 804.0, 906.2, 938.0, 938.0, 0.07718511047762146, 61.600024626874315, 0.1604254330727907], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 8, 53.333333333333336, 405.6, 84, 847, 92.0, 845.2, 847.0, 847.0, 0.099258210308296, 55.42958436451585, 0.13952369913843873], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 276.25, 172, 527, 194.0, 524.9, 527.0, 527.0, 0.10373242221689152, 0.16076499419746765, 0.23329664879443476], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c0e18523-be70-4c64-9bcd-0818c5597598", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 0.755916579497908, 2.884741108786611], "isController": false}, {"data": ["register", 25, 7, 28.0, 912.6399999999999, 193, 2436, 907.0, 1568.2000000000005, 2221.1999999999994, 2436.0, 0.10238600342378795, 0.03218759982635334, 0.046193685138466827], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 21, 0, 0.0, 101.85714285714285, 87, 271, 92.0, 105.80000000000001, 254.59999999999977, 271.0, 0.09995287935687461, 0.07760013582882355, 0.03553012508388902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 12, 0, 0.0, 289.5, 175, 847, 179.0, 697.9000000000005, 847.0, 847.0, 0.1646000219466696, 16.64374393466065, 0.3666797689427192], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f7702199-77c8-4b9b-ab84-21a3e9ead11b", 3, 0, 0.0, 335.33333333333337, 161, 600, 245.0, 600.0, 600.0, 600.0, 0.018515318340039992, 0.02552486105796529, 0.011873430055299086], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c5db7a53-b33e-4d5c-99b4-fb253e749a1b", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8f20a996-52e3-4cf5-8340-10e0e3083a6d", 1, 0, 0.0, 284.0, 284, 284, 284.0, 284.0, 284.0, 284.0, 3.5211267605633805, 1.1244223151408452, 2.1009848151408455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 282.22222222222223, 176, 695, 182.5, 526.7000000000003, 695.0, 695.0, 0.10959905014156544, 7.444785435123451, 0.24493294669223975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 104.3, 84, 259, 88.0, 242.10000000000005, 259.0, 259.0, 0.060793230065899866, 0.04517934382827129, 0.030515351810422392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 111.1, 82, 344, 85.5, 318.30000000000007, 344.0, 344.0, 0.06069729047295329, 0.016241267177333204, 0.03461642347285617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 120.39999999999999, 86, 259, 87.0, 258.1, 259.0, 259.0, 0.06079249091152261, 0.01638547606599633, 0.03573933547728184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 154.0, 82, 264, 87.5, 263.7, 264.0, 264.0, 0.0607282532125246, 0.01636816199868827, 0.035760875671047195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 91.5, 87, 96, 91.5, 96.0, 96.0, 96.0, 0.08740494712000699, 0.02577763088890831, 0.05403059719430119], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 813.793103448276, 666, 1313, 695.5, 1119.4, 1173.35, 1313.0, 0.25155814245997843, 300.9509941425988, 0.49672906645905895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, 28.0, 912.6399999999999, 193, 2436, 907.0, 1568.2000000000005, 2221.1999999999994, 2436.0, 0.10207956489606258, 0.032091263214199674, 0.046055428693340734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 87.66666666666667, 86, 89, 88.0, 89.0, 89.0, 89.0, 0.04725922736414285, 0.012737838625491629, 0.027829408301345837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 85.33333333333333, 83, 87, 86.0, 87.0, 87.0, 87.0, 0.04725922736414285, 0.012737838625491629, 0.027783256712123044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 21, 0, 0.0, 211.2380952380952, 85, 841, 87.0, 769.6, 834.0999999999999, 841.0, 0.09873617693522907, 12.71466578244894, 0.0568339098820808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 21, 0, 0.0, 166.52380952380955, 83, 595, 88.0, 408.4, 576.3999999999997, 595.0, 0.09873803389065468, 4.170276898473793, 0.05693140263254406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 21, 0, 0.0, 104.66666666666667, 84, 257, 89.0, 222.80000000000013, 256.7, 257.0, 0.09873060648801128, 0.07337303861071932, 0.04955813645980254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 87.0, 84, 91, 87.0, 91.0, 91.0, 91.0, 0.04725897920604915, 0.01264546904536862, 0.026952386578449904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 21, 0, 0.0, 119.14285714285714, 84, 264, 88.0, 255.8, 263.2, 264.0, 0.09873756964525002, 0.047605613936102686, 0.05512663974892446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 87.77777777777777, 84, 90, 88.0, 90.0, 90.0, 90.0, 0.04725823474740474, 0.03512062172145996, 0.02372141861344339], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 93.11111111111111, 89, 103, 92.0, 103.0, 103.0, 103.0, 0.045382346267302025, 0.035720870206489674, 0.016132005899705013], "isController": false}, {"data": ["deleteAccount", 15, 4, 26.666666666666668, 506.39999999999986, 84, 1344, 418.0, 1169.4, 1344.0, 1344.0, 0.08649720902338884, 0.017631690198712923, 0.05885301637392167], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1144.3043478260868, 645, 2190, 1156.0, 1492.0, 2053.199999999998, 2190.0, 0.11166891622889215, 0.057797388282532065, 0.0513633393982502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 176.88888888888889, 174, 182, 176.0, 182.0, 182.0, 182.0, 0.047236407723677515, 0.07320720611081662, 0.10623578807385674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2bc944fb-682e-4929-b77e-99a3cf8e9548", 3, 0, 0.0, 626.6666666666667, 194, 1344, 342.0, 1344.0, 1344.0, 1344.0, 0.03445187073658099, 0.028721107082156225, 0.022093159293966328], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ff14100-c781-4f80-acff-45ac5ba80be7", 3, 0, 0.0, 289.3333333333333, 180, 387, 301.0, 387.0, 387.0, 387.0, 0.027402765852500045, 0.027483047393083545, 0.01757273721660973], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dbd412af-c322-4fca-8a43-7111dce8f521", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 0.7527669270833334, 2.872721354166667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c6f900d-f5b0-4d4b-b139-bf8e0ca5fc41", 3, 0, 0.0, 314.3333333333333, 264, 404, 275.0, 404.0, 404.0, 404.0, 0.03050919852335479, 0.03059858094090368, 0.019564818063479473], "isController": false}, {"data": ["addBook", 58, 14, 24.137931034482758, 918.2413793103447, 443, 3325, 747.0, 1323.1, 2352.5499999999993, 3325.0, 0.29000870026100783, 90.9175761600973, 1.052541341865256], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fc4cb4c1-a3f7-44a6-a91f-354e772b1963", 2, 0, 0.0, 270.0, 173, 367, 270.0, 367.0, 367.0, 367.0, 0.02055139389829115, 0.023662200591880147, 0.012774377164318671], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 161.8620689655172, 85, 592, 90.0, 350.1, 360.05, 592.0, 0.2523966805484841, 0.18757214247792617, 0.12200816100732385], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 497.6896551724138, 406, 698, 436.0, 623.3000000000001, 687.4, 698.0, 0.25243183252453594, 74.22334028790286, 0.1269554626466172], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5e0131c2-8acb-4bc7-98b3-724771ddcb73", 1, 0, 0.0, 1593.0, 1593, 1593, 1593.0, 1593.0, 1593.0, 1593.0, 0.6277463904582549, 0.11341121311989956, 0.432801710608914], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 129.8965517241379, 84, 359, 91.5, 257.0, 261.05, 359.0, 0.252991184565793, 0.4476758070636883, 0.12303672843141103], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 643.896551724138, 567, 846, 600.0, 768.2, 801.2499999999999, 846.0, 0.2522430056928637, 226.9686999183472, 0.1266141649669257], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 102.77777777777776, 89, 263, 92.0, 117.20000000000023, 263.0, 263.0, 0.1076194575979337, 0.08039930181876884, 0.038255354068015494], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 14, 8.045977011494253, 167.88505747126445, 85, 2017, 94.0, 292.5, 371.25, 1594.75, 0.720544632356595, 1.6359294249308443, 0.3431985271280913], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 109.10000000000001, 90, 255, 91.0, 239.80000000000007, 255.0, 255.0, 0.061206627453620675, 0.04739927301828242, 0.021757043352654225], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 98.68750000000001, 88, 158, 93.0, 129.30000000000004, 158.0, 158.0, 0.11098933115054314, 0.09007044354111463, 0.03945323880741964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 270.3, 172, 604, 177.0, 578.8000000000001, 604.0, 604.0, 0.060665991251964056, 0.0940204376141279, 0.13643923618483716], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e0131c2-8acb-4bc7-98b3-724771ddcb73", 3, 0, 0.0, 459.6666666666667, 172, 987, 220.0, 987.0, 987.0, 987.0, 0.03626867836936022, 0.030235704851540212, 0.023258234501184777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 21, 0, 0.0, 334.9047619047619, 173, 929, 179.0, 857.6, 922.1999999999999, 929.0, 0.09868977573923342, 16.997854451966276, 0.21834837520207906], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/12ac0d54-05a0-4c68-a4c8-2db96e71fcc1", 3, 0, 0.0, 357.0, 317, 436, 318.0, 436.0, 436.0, 436.0, 0.03263459049028033, 0.02688741814156885, 0.020927781011019612], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1d1d5643-ccab-4f93-8046-c99db8052e4d", 1, 0, 0.0, 164.0, 164, 164, 164.0, 164.0, 164.0, 164.0, 6.097560975609756, 1.947170350609756, 3.6382907774390243], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 104.93333333333335, 87, 265, 91.0, 176.80000000000007, 265.0, 265.0, 0.06994246066902295, 0.057989403425781724, 0.024862359065941753], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7751c529-7d81-47ae-ab36-0e71259c0679", 1, 0, 0.0, 374.0, 374, 374, 374.0, 374.0, 374.0, 374.0, 2.6737967914438503, 0.4830589906417112, 1.8434575534759359], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 115.39999999999999, 88, 277, 91.0, 266.2, 277.0, 277.0, 0.07688561982623851, 0.05969147242369102, 0.027330435172608216], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f7702199-77c8-4b9b-ab84-21a3e9ead11b", 1, 0, 0.0, 331.0, 331, 331, 331.0, 331.0, 331.0, 331.0, 3.0211480362537766, 0.5458128776435045, 2.082939954682779], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab49530d-1ef5-48f6-9c89-786f8e47dfa9", 3, 0, 0.0, 283.0, 217, 366, 266.0, 366.0, 366.0, 366.0, 0.025463218381048577, 0.025537817653649306, 0.01632895189149274], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c0e18523-be70-4c64-9bcd-0818c5597598", 3, 0, 0.0, 612.3333333333334, 347, 791, 699.0, 791.0, 791.0, 791.0, 0.08909215098149853, 0.040311878211029606, 0.0571326619249844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 97.7777777777778, 85, 254, 88.5, 112.70000000000022, 254.0, 254.0, 0.10966047897260316, 0.08149572704897559, 0.055044420109294945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 144.5, 83, 276, 88.5, 270.6, 276.0, 276.0, 0.10965847477245866, 0.03849231400704251, 0.062027954534377934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 163.77777777777777, 85, 606, 87.0, 307.2000000000005, 606.0, 606.0, 0.10966381946898342, 5.509898920801398, 0.06394676278497362], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 123.94444444444444, 83, 605, 86.5, 283.7000000000005, 605.0, 605.0, 0.10966181514673361, 1.81926047955721, 0.06405268564831457], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 18.91891891891892, 0.5208333333333334], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 10.81081081081081, 0.2976190476190476], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 10.81081081081081, 0.2976190476190476], "isController": false}, {"data": ["401/Unauthorized", 22, 59.45945945945946, 1.6369047619047619], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1344, 37, "401/Unauthorized", 22, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
