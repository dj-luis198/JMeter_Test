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

    var data = {"OkPercent": 99.45652173913044, "KoPercent": 0.5434782608695652};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8053892215568862, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.36363636363636365, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ef422d90-844c-4092-9361-847672b464a4"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=df154f4d-3bb6-40cb-9401-6aeb92ba1665"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0c1192af-f270-4c6e-a605-dfb8a4143c94"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c8c7e3ca-3166-449d-ae94-da45dd6f71d3"], "isController": false}, {"data": [0.9, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9d74f639-3885-4b18-b8b4-022d33855db1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5c299e36-5bd7-4405-929b-3e16db669cb1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/74426290-92dd-4571-a56a-9a2b8b183fbd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e276834e-15f3-46fb-a958-360e0e882aba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=17408c38-ad58-4676-b664-c5167e8ba679"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/aaac6c69-3ae7-4ae5-82dc-e2caf464ea62"], "isController": false}, {"data": [0.575, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da0555b2-d1a6-4fa6-abf7-bb95ecd215d3"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/d93ffebd-cbee-4a2a-8f8f-f11ccc7f6c67"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/85fd9c5d-9547-4b48-ba4b-6cb9faf06ef2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c61d6221-a94d-43fe-8764-fb402d720851"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=48b1bbe7-33bf-4b6e-ac80-ef99c433a8ab"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/2c0776dd-c275-44b3-aefe-8f0acaedee4b"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c1192af-f270-4c6e-a605-dfb8a4143c94"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=85fd9c5d-9547-4b48-ba4b-6cb9faf06ef2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5c299e36-5bd7-4405-929b-3e16db669cb1"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9d74f639-3885-4b18-b8b4-022d33855db1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/df154f4d-3bb6-40cb-9401-6aeb92ba1665"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=74426290-92dd-4571-a56a-9a2b8b183fbd"], "isController": false}, {"data": [0.3416666666666667, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9028571428571428, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d93ffebd-cbee-4a2a-8f8f-f11ccc7f6c67"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/821c350e-19c2-4300-b7a7-e60e82e5aaef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d0d75081-c9ac-4685-8a4b-faa2c1f69b16"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8c7e3ca-3166-449d-ae94-da45dd6f71d3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aaac6c69-3ae7-4ae5-82dc-e2caf464ea62"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c61d6221-a94d-43fe-8764-fb402d720851"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/da0555b2-d1a6-4fa6-abf7-bb95ecd215d3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/48b1bbe7-33bf-4b6e-ac80-ef99c433a8ab"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/17408c38-ad58-4676-b664-c5167e8ba679"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2c0776dd-c275-44b3-aefe-8f0acaedee4b"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1288, 7, 0.5434782608695652, 350.42934782608654, 77, 3641, 96.5, 938.0, 1221.299999999997, 2457.8399999999956, 4.9912227333144745, 698.6609521590526, 3.632895150172639], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1345.4909090909093, 974, 1779, 1331.0, 1610.2, 1686.5999999999997, 1779.0, 0.2419698989445713, 291.17186142356394, 1.1897641027206216], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ef422d90-844c-4092-9361-847672b464a4", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 1.174029181985294, 2.193675321691176], "isController": false}, {"data": ["deleteBook", 15, 0, 0.0, 768.9333333333333, 431, 2497, 618.0, 1689.4000000000005, 2497.0, 2497.0, 0.08089000577015375, 0.014613917058084416, 0.05497992579690137], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 0, 0.0, 768.9333333333333, 431, 2497, 618.0, 1689.4000000000005, 2497.0, 2497.0, 0.08075196227268322, 0.014588977559029685, 0.054886099357214384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 111.46666666666667, 77, 239, 80.0, 237.8, 239.0, 239.0, 0.11340697226065459, 0.06441161627616866, 0.06277253113021389], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 86.79999999999998, 79, 128, 82.0, 113.00000000000001, 128.0, 128.0, 0.11338725527250737, 0.08426533326404112, 0.056915087119207806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 194.53333333333333, 78, 628, 80.0, 584.8000000000001, 628.0, 628.0, 0.1134095445472691, 6.693688262679187, 0.06483393298630012], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 277.20000000000005, 78, 939, 81.0, 934.8, 939.0, 939.0, 0.11340868710543228, 20.433520949892262, 0.06472269213321741], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=df154f4d-3bb6-40cb-9401-6aeb92ba1665", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c1192af-f270-4c6e-a605-dfb8a4143c94", 3, 0, 0.0, 535.0, 357, 844, 404.0, 844.0, 844.0, 844.0, 0.08296001327360213, 0.037537245589292625, 0.053200268928709694], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8c7e3ca-3166-449d-ae94-da45dd6f71d3", 3, 0, 0.0, 376.6666666666667, 195, 492, 443.0, 492.0, 492.0, 492.0, 0.024395400653796737, 0.024466871554149658, 0.015644185966139184], "isController": false}, {"data": ["goToProfile", 15, 0, 0.0, 456.3333333333333, 178, 2319, 202.0, 1704.0000000000005, 2319.0, 2319.0, 0.08193184363034538, 0.17301167631186537, 0.052967656721961555], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9d74f639-3885-4b18-b8b4-022d33855db1", 3, 0, 0.0, 903.3333333333334, 191, 2135, 384.0, 2135.0, 2135.0, 2135.0, 0.043429167028576396, 0.027920769818176552, 0.02785008432496598], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c299e36-5bd7-4405-929b-3e16db669cb1", 3, 0, 0.0, 308.3333333333333, 191, 510, 224.0, 510.0, 510.0, 510.0, 0.02023158420048151, 0.02403159204022039, 0.012974030232730659], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 101.95, 78, 316, 81.0, 229.60000000000034, 312.44999999999993, 316.0, 0.095671807431786, 0.07109984907772378, 0.04802276271478321], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 103.19999999999999, 78, 235, 80.0, 233.9, 234.95, 235.0, 0.09567409576020244, 0.03997009586544395, 0.05376061982462938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 2, 0, 0.0, 630.0, 627, 633, 630.0, 633.0, 633.0, 633.0, 0.052935260176803764, 15.564724108040867, 0.0301896405695834], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 2, 0, 0.0, 894.0, 850, 938, 894.0, 938.0, 938.0, 938.0, 0.052632964025369086, 47.35923354890918, 0.029965837916787284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 2, 0, 0.0, 79.0, 78, 80, 79.0, 80.0, 80.0, 80.0, 0.0537244473097483, 0.09506708840357805, 0.029747814086550087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 112.8125, 79, 240, 82.0, 238.6, 240.0, 240.0, 0.08576237390250961, 0.06373551419903302, 0.04304869158778315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 110.24999999999999, 78, 241, 81.0, 236.8, 241.0, 241.0, 0.08576835040659558, 0.022949734386139835, 0.04891476234126154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 90.43749999999999, 78, 236, 80.0, 134.5000000000001, 236.0, 236.0, 0.08576835040659558, 0.023117250695527714, 0.05042240912575248], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 119.00000000000001, 79, 235, 81.0, 234.3, 235.0, 235.0, 0.08576835040659558, 0.023117250695527714, 0.05050616728044642], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 2, 0, 0.0, 90.5, 81, 100, 90.5, 100.0, 100.0, 100.0, 0.05372156114856697, 0.0399239336270112, 0.030165915684009777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 598.4374999999999, 80, 1023, 813.5, 1020.9, 1023.0, 1023.0, 0.0754354037208513, 42.43069261782067, 0.04029606038604068], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 172.05, 78, 1011, 80.0, 644.300000000001, 994.9499999999998, 1011.0, 0.09567409576020244, 8.631980396975742, 0.055423704692336026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 432.5, 79, 710, 588.5, 708.6, 710.0, 710.0, 0.07543611504007544, 13.870576231730317, 0.040370108439415374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 142.25, 79, 621, 80.0, 446.5000000000005, 613.4499999999999, 621.0, 0.09567409576020244, 2.836344526006611, 0.05551713642647685], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 595.1428571428572, 189, 1458, 430.0, 1424.0, 1458.0, 1458.0, 0.07557232541443323, 0.013653203321943506, 0.05210357592049792], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/74426290-92dd-4571-a56a-9a2b8b183fbd", 3, 0, 0.0, 952.6666666666667, 346, 2108, 404.0, 2108.0, 2108.0, 2108.0, 0.021827706635622817, 0.025799610284487778, 0.013997585309953434], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e276834e-15f3-46fb-a958-360e0e882aba", 2, 0, 0.0, 294.5, 192, 397, 294.5, 397.0, 397.0, 397.0, 0.014694753238356246, 0.029045098197688513, 0.009133994566614989], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 234.18749999999997, 160, 476, 166.5, 474.6, 476.0, 476.0, 0.08572515443922354, 0.13285724618657008, 0.19279788151712093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=17408c38-ad58-4676-b664-c5167e8ba679", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aaac6c69-3ae7-4ae5-82dc-e2caf464ea62", 3, 0, 0.0, 703.3333333333334, 213, 1294, 603.0, 1294.0, 1294.0, 1294.0, 0.01820653493227169, 0.021519507922877115, 0.011675414653833082], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 817.7499999999999, 139, 2144, 672.0, 1487.0000000000002, 2111.8499999999995, 2144.0, 0.09844069932272799, 0.06046796862694912, 0.04450980838517877], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 81.0, 79, 83, 81.0, 83.0, 83.0, 83.0, 0.0754354037208513, 0.056060881085515456, 0.03786503663331793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 128.93750000000003, 78, 242, 80.0, 239.9, 242.0, 242.0, 0.07543575937878652, 0.09099806813734966, 0.03906231583066558], "isController": false}, {"data": ["login", 20, 0, 0.0, 3801.4, 2331, 5961, 3881.0, 5168.500000000001, 5923.849999999999, 5961.0, 0.0959205010886977, 11.611560713480667, 0.16062937037783084], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da0555b2-d1a6-4fa6-abf7-bb95ecd215d3", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 0.47418389107611547, 1.8095882545931758], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d93ffebd-cbee-4a2a-8f8f-f11ccc7f6c67", 3, 0, 0.0, 1587.0, 421, 2319, 2021.0, 2319.0, 2319.0, 2319.0, 0.061831447474185376, 0.02797711978812424, 0.03965102588676601], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 90.04999999999998, 82, 129, 85.0, 109.10000000000002, 128.04999999999998, 129.0, 0.09368295813308601, 0.07584294169172687, 0.03330136402387042], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 690.1250000000001, 161, 1107, 894.5, 1103.5, 1107.0, 1107.0, 0.07540660656131735, 56.42664770799263, 0.15753279598271305], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/85fd9c5d-9547-4b48-ba4b-6cb9faf06ef2", 2, 0, 0.0, 1327.5, 202, 2453, 1327.5, 2453.0, 2453.0, 2453.0, 0.01490779528615513, 0.025477189209737773, 0.009266417675427482], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c61d6221-a94d-43fe-8764-fb402d720851", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 385.5333333333333, 160, 1067, 318.0, 1034.6, 1067.0, 1067.0, 0.11331787173927824, 27.25401050834397, 0.24905586146134726], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 2, 0, 0.0, 985.0, 951, 1019, 985.0, 1019.0, 1019.0, 1019.0, 0.052521008403361345, 62.8333853072479, 0.11842871914390757], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=48b1bbe7-33bf-4b6e-ac80-ef99c433a8ab", 1, 0, 0.0, 817.0, 817, 817, 817.0, 817.0, 817.0, 817.0, 1.2239902080783354, 0.2211310434516524, 0.8438838739290087], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c0776dd-c275-44b3-aefe-8f0acaedee4b", 3, 0, 0.0, 852.6666666666666, 178, 1637, 743.0, 1637.0, 1637.0, 1637.0, 0.037025609379821044, 0.023466426257327984, 0.02374363622338784], "isController": false}, {"data": ["register", 23, 3, 13.043478260869565, 1267.2608695652175, 213, 3077, 1286.0, 2022.2, 2868.199999999997, 3077.0, 0.09003331232556046, 0.028777631419277305, 0.04062049833438372], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 93.33333333333333, 80, 240, 83.0, 111.30000000000021, 240.0, 240.0, 0.0847972638749523, 0.06583381326229207, 0.030142777393049453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 291.35, 159, 1094, 165.0, 953.4000000000011, 1089.6, 1094.0, 0.09563475175609312, 11.574634779848802, 0.21263789335768832], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c1192af-f270-4c6e-a605-dfb8a4143c94", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 0.9558945105820106, 3.647900132275132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 243.49999999999997, 160, 793, 166.5, 509.50000000000045, 793.0, 793.0, 0.10257462303826033, 6.9676339222113945, 0.22923469358680662], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 100.625, 79, 242, 80.5, 242.0, 242.0, 242.0, 0.0504187910834368, 0.03746943360790567, 0.025307869743053237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 80.74999999999999, 78, 87, 80.0, 87.0, 87.0, 87.0, 0.05047032029727019, 0.013504753673293, 0.028783854544536906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 99.875, 80, 235, 80.5, 235.0, 235.0, 235.0, 0.05047000189262507, 0.013603242697621603, 0.029670840956406538], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=85fd9c5d-9547-4b48-ba4b-6cb9faf06ef2", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 100.375, 79, 234, 81.0, 234.0, 234.0, 234.0, 0.0504696834919974, 0.013603156878702425, 0.029719940571947687], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 933.9090909090907, 625, 1416, 866.0, 1268.2, 1350.5999999999997, 1416.0, 0.24593645896214816, 294.2255062657903, 0.4856284375209605], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5c299e36-5bd7-4405-929b-3e16db669cb1", 1, 0, 0.0, 809.0, 809, 809, 809.0, 809.0, 809.0, 809.0, 1.2360939431396785, 0.22331775339925833, 0.8522288318912237], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 3, 13.043478260869565, 1267.2608695652175, 213, 3077, 1286.0, 2022.2, 2868.199999999997, 3077.0, 0.08949660107473743, 0.028606080710369543, 0.04037834931301631], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 79.5, 79, 80, 79.5, 80.0, 80.0, 80.0, 0.019027323236167137, 0.005128458215998174, 0.01120456631973514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 118.25, 79, 236, 79.0, 236.0, 236.0, 236.0, 0.01902741374635506, 0.005128482611322262, 0.011186038159478268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 209.77777777777777, 79, 1004, 80.5, 868.1000000000003, 1004.0, 1004.0, 0.08639101533440523, 8.657896453768808, 0.0499635537904058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 166.83333333333331, 78, 472, 80.5, 463.0, 472.0, 472.0, 0.08639142997014697, 2.8431367108382846, 0.050048160222505925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 116.83333333333333, 79, 263, 81.0, 242.30000000000004, 263.0, 263.0, 0.08639018607486189, 0.0642020816435253, 0.043363823869608416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 156.25, 78, 236, 155.5, 236.0, 236.0, 236.0, 0.019013666072489603, 0.005087641117052882, 0.010843731431966727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 123.16666666666667, 78, 239, 80.0, 235.4, 239.0, 239.0, 0.08639142997014697, 0.03753377664935638, 0.04846394237691621], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 81.25, 80, 83, 81.0, 83.0, 83.0, 83.0, 0.019026961204026107, 0.01414015378541393, 0.009550642635614665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 125.0, 83, 240, 88.5, 240.0, 240.0, 240.0, 0.019470594534604112, 0.015325487495010661, 0.006921187900972557], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 694.9230769230769, 394, 2135, 510.0, 1635.7999999999995, 2135.0, 2135.0, 0.07400576106386128, 0.0133701814422015, 0.05037306197413214], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9d74f639-3885-4b18-b8b4-022d33855db1", 1, 0, 0.0, 1390.0, 1390, 1390, 1390.0, 1390.0, 1390.0, 1390.0, 0.7194244604316546, 0.12997414568345325, 0.4960094424460432], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/df154f4d-3bb6-40cb-9401-6aeb92ba1665", 3, 0, 0.0, 298.0, 200, 447, 247.0, 447.0, 447.0, 447.0, 0.03812380068877, 0.03178224399867837, 0.024447879998983364], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 2003.7000000000003, 990, 3002, 1859.5, 2912.8, 2997.95, 3002.0, 0.09604948469451462, 0.04971311219540307, 0.04417901102648084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 238.5, 161, 319, 237.0, 319.0, 319.0, 319.0, 0.019006077193182522, 0.029455707524981112, 0.0427451130624017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=74426290-92dd-4571-a56a-9a2b8b183fbd", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["addBook", 60, 4, 6.666666666666667, 1260.4166666666667, 409, 4827, 945.0, 2729.9999999999995, 3482.199999999998, 4827.0, 0.28436423266681515, 103.14743718956903, 1.0314683087911203], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 148.85454545454553, 79, 340, 82.0, 320.4, 322.4, 340.0, 0.2468936292465704, 0.18348247251625008, 0.11934799460649645], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 508.0727272727274, 386, 722, 467.0, 634.8, 710.0, 722.0, 0.2465836949894193, 72.50379367613698, 0.12401426066362398], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 119.4727272727273, 78, 318, 83.0, 241.4, 277.5999999999998, 318.0, 0.24719767724073458, 0.4374240148048936, 0.12021918287684162], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 783.6363636363636, 544, 1092, 781.0, 956.1999999999999, 1035.7999999999997, 1092.0, 0.24632637797215168, 221.64490789492837, 0.1236442951930527], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 106.38888888888887, 80, 242, 84.0, 237.5, 242.0, 242.0, 0.1016713642602561, 0.07595565787021086, 0.03614099276438791], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 4, 2.2857142857142856, 272.70857142857153, 80, 3641, 90.0, 510.0000000000001, 1323.7999999999975, 2799.6800000000103, 0.7443451039105765, 1.5862110468256871, 0.35965326544197085], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 104.875, 80, 238, 83.5, 238.0, 238.0, 238.0, 0.054213397485853694, 0.04198361738894724, 0.019271168637549553], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 92.86666666666666, 80, 241, 82.0, 149.80000000000007, 241.0, 241.0, 0.10549636037556705, 0.08561276901571896, 0.037500659352252344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d93ffebd-cbee-4a2a-8f8f-f11ccc7f6c67", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 208.0, 4.807692307692308, 0.8685772235576924, 3.3146784855769234], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/821c350e-19c2-4300-b7a7-e60e82e5aaef", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 1.6719159031413613, 3.1239774214659684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 202.24999999999997, 161, 478, 162.5, 478.0, 478.0, 478.0, 0.05039243105685526, 0.07809842586643487, 0.11333375851947038], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d0d75081-c9ac-4685-8a4b-faa2c1f69b16", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 1.3646834935897436, 2.549913194444444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 352.83333333333337, 159, 1085, 242.0, 948.2000000000003, 1085.0, 1085.0, 0.08635702874249773, 11.598191240038956, 0.19176395325685938], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8c7e3ca-3166-449d-ae94-da45dd6f71d3", 1, 0, 0.0, 1458.0, 1458, 1458, 1458.0, 1458.0, 1458.0, 1458.0, 0.6858710562414265, 0.12391225137174211, 0.47287594307270236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aaac6c69-3ae7-4ae5-82dc-e2caf464ea62", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c61d6221-a94d-43fe-8764-fb402d720851", 3, 0, 0.0, 934.3333333333333, 394, 1975, 434.0, 1975.0, 1975.0, 1975.0, 0.022625799444913722, 0.02269208596672499, 0.014509383107578133], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da0555b2-d1a6-4fa6-abf7-bb95ecd215d3", 3, 0, 0.0, 672.3333333333334, 280, 1002, 735.0, 1002.0, 1002.0, 1002.0, 0.054146737659056046, 0.03481113505098818, 0.03472300559516289], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 83.625, 81, 93, 82.0, 92.3, 93.0, 93.0, 0.08832751843836947, 0.0732324835489997, 0.03139767256988915], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 85.4375, 82, 90, 84.0, 90.0, 90.0, 90.0, 0.07404459335634886, 0.05748579269364975, 0.026320539044639633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/48b1bbe7-33bf-4b6e-ac80-ef99c433a8ab", 3, 0, 0.0, 339.3333333333333, 196, 468, 354.0, 468.0, 468.0, 468.0, 0.05035584799248019, 0.031324878096884654, 0.032291998875386065], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/17408c38-ad58-4676-b664-c5167e8ba679", 3, 0, 0.0, 1392.6666666666667, 190, 3101, 887.0, 3101.0, 3101.0, 3101.0, 0.05315473342901185, 0.03417337191481068, 0.03408685704920356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 91.77777777777777, 79, 243, 81.0, 116.1000000000002, 243.0, 243.0, 0.1027121719630008, 0.07633199498422226, 0.05155669569236563], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 106.61111111111113, 79, 236, 81.5, 235.1, 236.0, 236.0, 0.10272565401999727, 0.03605875550723645, 0.05810642734442771], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2c0776dd-c275-44b3-aefe-8f0acaedee4b", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 141.55555555555557, 78, 704, 81.5, 282.80000000000064, 704.0, 704.0, 0.10263545028452828, 5.156768745580974, 0.05984840601443739], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 132.88888888888889, 78, 712, 81.0, 283.6000000000007, 712.0, 712.0, 0.10263662074628227, 1.702714364422726, 0.059949319604734964], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 42.857142857142854, 0.2329192546583851], "isController": false}, {"data": ["401/Unauthorized", 4, 57.142857142857146, 0.3105590062111801], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1288, 7, "401/Unauthorized", 4, "406/Not Acceptable", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
