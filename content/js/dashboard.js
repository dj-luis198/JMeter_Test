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

    var data = {"OkPercent": 97.37039819684448, "KoPercent": 2.629601803155522};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7765126870527, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f7d1295b-f2cf-4971-97b8-33f6c467d283"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8525b353-1a13-45b0-b808-114e7bc94d27"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=64752d41-8fdc-4f91-8b9a-80f713acbe0a"], "isController": false}, {"data": [0.13793103448275862, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d51b732-b6eb-4d9b-917b-f8f290303521"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.41379310344827586, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e04d4fdf-7877-41e8-a3ce-d0380f9c752a"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6b60d4e2-75e8-4f4f-b46b-ab3abd80e361"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.2033898305084746, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/64752d41-8fdc-4f91-8b9a-80f713acbe0a"], "isController": false}, {"data": [0.5517241379310345, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6b60d4e2-75e8-4f4f-b46b-ab3abd80e361"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e1ca726a-a0cb-4379-a57f-7f988870412f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/56e3159d-8a4a-4285-a9cf-42e743925ba2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=03969dbf-dcea-4ec7-a15d-c9fbdef9234e"], "isController": false}, {"data": [0.8693181818181818, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/03969dbf-dcea-4ec7-a15d-c9fbdef9234e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/2d51b732-b6eb-4d9b-917b-f8f290303521"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e1ca726a-a0cb-4379-a57f-7f988870412f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6b963b4e-575b-45e0-a158-1af9714b0b5c"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f43e7d81-c163-45ff-bf0c-0a7e6a045925"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=34d6292f-da0f-49ab-83d3-df168b0c344c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/34d6292f-da0f-49ab-83d3-df168b0c344c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e4fa7879-c8ac-4d33-933a-013956edb9dd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6b963b4e-575b-45e0-a158-1af9714b0b5c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f43e7d81-c163-45ff-bf0c-0a7e6a045925"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8525b353-1a13-45b0-b808-114e7bc94d27"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f7d1295b-f2cf-4971-97b8-33f6c467d283"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "register"], "isController": true}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1331, 35, 2.629601803155522, 355.08264462809893, 98, 2564, 111.0, 1023.0, 1243.5999999999995, 1629.4800000000007, 5.276197649297366, 752.7234815075417, 3.877072937932333], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f7d1295b-f2cf-4971-97b8-33f6c467d283", 1, 0, 0.0, 1276.0, 1276, 1276, 1276.0, 1276.0, 1276.0, 1276.0, 0.7836990595611285, 0.14158625587774296, 0.5403237656739812], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8525b353-1a13-45b0-b808-114e7bc94d27", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=64752d41-8fdc-4f91-8b9a-80f713acbe0a", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["see books", 58, 0, 0.0, 1668.5689655172412, 1227, 2189, 1631.5, 2048.8, 2161.4, 2189.0, 0.25411735840624605, 305.7886096138511, 1.249493065991649], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 107.8125, 102, 130, 105.5, 124.4, 130.0, 130.0, 0.08381571020718195, 0.0650717672018649, 0.02979386573770921], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 301.44444444444446, 203, 1286, 208.0, 514.7000000000012, 1286.0, 1286.0, 0.10565302373084305, 7.176741871687337, 0.23611433124570785], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d51b732-b6eb-4d9b-917b-f8f290303521", 1, 0, 0.0, 737.0, 737, 737, 737.0, 737.0, 737.0, 737.0, 1.3568521031207597, 0.2451344131614654, 0.9354859226594301], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 408.0, 204, 1215, 210.0, 1212.2, 1215.0, 1215.0, 0.0851815965160727, 12.853863401327768, 0.18885109325255278], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 15, 0, 0.0, 103.6, 100, 114, 103.0, 108.60000000000001, 114.0, 114.0, 0.08340376317779459, 0.061982679470997726, 0.04186477956385392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 15, 0, 0.0, 142.4, 100, 305, 102.0, 302.6, 305.0, 305.0, 0.08340515443854431, 0.02231739484000111, 0.0475670021407323], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 15, 0, 0.0, 129.33333333333331, 98, 305, 103.0, 300.8, 305.0, 305.0, 0.08340515443854431, 0.022480295532263894, 0.04903310837109733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 15, 0, 0.0, 115.99999999999999, 99, 306, 103.0, 186.00000000000006, 306.0, 306.0, 0.08340469067980383, 0.022480170534790875, 0.049114285624923544], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 207.0, 107, 307, 207.0, 307.0, 307.0, 307.0, 0.054905836490418934, 0.01619293224619777, 0.033940814939878106], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1169.9482758620686, 789, 1771, 1106.5, 1619.3, 1690.3, 1771.0, 0.25649643558401586, 306.8589095474165, 0.5064802663582814], "isController": false}, {"data": ["deleteBook", 12, 2, 16.666666666666668, 548.5000000000001, 108, 1362, 481.5, 1181.4000000000005, 1362.0, 1362.0, 0.07425283088917764, 0.014828812418785964, 0.049876535331972026], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 2, 16.666666666666668, 548.5000000000001, 108, 1362, 481.5, 1181.4000000000005, 1362.0, 1362.0, 0.0725917680934982, 0.014497086499140999, 0.04876077912139764], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e04d4fdf-7877-41e8-a3ce-d0380f9c752a", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 520.0, 1.9230769230769231, 0.6141075721153846, 1.1474609375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 8, 38.095238095238095, 1001.6190476190479, 383, 2172, 998.0, 1559.0000000000002, 2114.999999999999, 2172.0, 0.09314621294111386, 0.028952254803683266, 0.0420249515417916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 114.52941176470587, 98, 296, 103.0, 150.39999999999986, 296.0, 296.0, 0.08347901239417807, 0.02971254370371825, 0.04719671645125808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 188.14285714285714, 101, 305, 103.0, 305.0, 305.0, 305.0, 0.03579244472623893, 0.009647182367619087, 0.021076996259689527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 117.05882352941177, 99, 307, 102.0, 164.59999999999988, 307.0, 307.0, 0.08346958515616178, 0.06203159599984288, 0.04189781911158901], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 158.85714285714286, 101, 303, 103.0, 303.0, 303.0, 303.0, 0.03579244472623893, 0.009647182367619087, 0.021042042700386558], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 203.6470588235294, 100, 811, 103.0, 406.99999999999966, 811.0, 811.0, 0.08347860246998454, 1.4650283735176408, 0.0487358132411795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 199.35294117647058, 99, 1144, 103.0, 472.7999999999994, 1144.0, 1144.0, 0.08347737272155877, 4.439593110722914, 0.04865357442744343], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 127.74999999999994, 100, 306, 103.0, 304.6, 306.0, 306.0, 0.0812975082313727, 0.021912219015487178, 0.04779404292508435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 114.6875, 98, 296, 103.0, 163.00000000000014, 296.0, 296.0, 0.08129709515316881, 0.02191210767800253, 0.0478731917747664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 104.49999999999999, 101, 121, 104.0, 110.50000000000001, 121.0, 121.0, 0.08129709515316881, 0.060417079503477994, 0.04080733096555544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 130.14285714285714, 99, 301, 103.0, 301.0, 301.0, 301.0, 0.03582945180938732, 0.009587177534933716, 0.020433984235041204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 114.5625, 100, 302, 102.0, 163.40000000000015, 302.0, 302.0, 0.08129833440037397, 0.021753655884475066, 0.04636545633771328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 103.57142857142857, 102, 106, 103.0, 106.0, 106.0, 106.0, 0.035828351486364755, 0.026626343243284743, 0.017984152992179182], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 135.0, 104, 306, 105.0, 306.0, 306.0, 306.0, 0.035341397903750224, 0.02781754561564715, 0.012562762536098712], "isController": false}, {"data": ["deleteAccount", 11, 1, 9.090909090909092, 561.0909090909091, 103, 963, 540.0, 943.0000000000001, 963.0, 963.0, 0.08209261539609687, 0.01547982200828389, 0.055870205044964365], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1275.190476190476, 881, 2260, 1263.0, 1798.8000000000002, 2217.3999999999996, 2260.0, 0.09179324663971151, 0.04751017648344443, 0.04222130778057043], "isController": false}, {"data": ["goToProfile", 12, 2, 16.666666666666668, 391.6666666666667, 102, 2564, 194.0, 1900.4000000000024, 2564.0, 2564.0, 0.07427489137297137, 0.1257499056089922, 0.04800546771518055], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 293.14285714285717, 206, 407, 212.0, 407.0, 407.0, 407.0, 0.03577269010629599, 0.0554406828112224, 0.08045361847148405], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6b60d4e2-75e8-4f4f-b46b-ab3abd80e361", 1, 0, 0.0, 862.0, 862, 862, 862.0, 862.0, 862.0, 862.0, 1.160092807424594, 0.20958707946635732, 0.7998296113689095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 104.6111111111111, 99, 126, 103.0, 112.50000000000003, 126.0, 126.0, 0.1057169370279445, 0.07856502839674392, 0.05306494690660496], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 728.5, 587, 831, 798.0, 831.0, 831.0, 831.0, 0.043063540253644256, 12.662110678681396, 0.02455967530090649], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 113.61111111111111, 100, 306, 102.0, 124.20000000000029, 306.0, 306.0, 0.10571631613877029, 0.037108537620325725, 0.05979808550688037], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1115.625, 900, 1259, 1164.5, 1259.0, 1259.0, 1259.0, 0.04296870803837106, 38.66331902385838, 0.024463629674189774], "isController": false}, {"data": ["addBook", 59, 20, 33.898305084745765, 1040.830508474576, 519, 3035, 754.0, 1858.0, 2125.0, 3035.0, 0.2880212452281226, 77.06879497280885, 1.047762137471564], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 253.37499999999997, 98, 312, 302.5, 312.0, 312.0, 312.0, 0.04317999039245214, 0.07640834237414383, 0.02390923296144567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 103.18181818181817, 102, 104, 103.0, 104.0, 104.0, 104.0, 0.06713703278728546, 0.04989383003039477, 0.033699643410805405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 119.36363636363636, 99, 302, 101.0, 262.20000000000016, 302.0, 302.0, 0.06713826209556827, 0.017964730287290728, 0.03828979010137877], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 120.72727272727273, 100, 305, 103.0, 264.8000000000002, 305.0, 305.0, 0.06713826209556827, 0.018095859705446134, 0.03946995486477743], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 177.62068965517238, 100, 728, 104.0, 412.1, 422.54999999999984, 728.0, 0.25786602526197855, 0.1916367629144196, 0.12465203369597595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 138.72727272727272, 101, 301, 103.0, 301.0, 301.0, 301.0, 0.06713744255171109, 0.01809563881276588, 0.03953503697136893], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/64752d41-8fdc-4f91-8b9a-80f713acbe0a", 3, 0, 0.0, 500.66666666666663, 187, 963, 352.0, 963.0, 963.0, 963.0, 0.03036283588887202, 0.02531224697636759, 0.019470959212590455], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 649.2241379310345, 487, 927, 602.0, 825.3000000000001, 916.5, 927.0, 0.25815525813300333, 75.90621745240819, 0.12983394329931322], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b60d4e2-75e8-4f4f-b46b-ab3abd80e361", 3, 0, 0.0, 348.3333333333333, 183, 594, 268.0, 594.0, 594.0, 594.0, 0.03961232735627327, 0.03302316743470568, 0.02540243648823514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 128.0, 98, 308, 103.0, 308.0, 308.0, 308.0, 0.043225018640789294, 0.0321232804547272, 0.02427186105317758], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e1ca726a-a0cb-4379-a57f-7f988870412f", 3, 0, 0.0, 677.6666666666666, 201, 1371, 461.0, 1371.0, 1371.0, 1371.0, 0.021415569118749332, 0.0253124776921155, 0.013733291394510475], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 163.6724137931034, 99, 412, 106.0, 308.1, 316.2499999999998, 412.0, 0.25861915208589725, 0.4576346714644978, 0.12577376732302423], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 653.0588235294117, 100, 1305, 902.0, 1301.0, 1305.0, 1305.0, 0.10827887542833849, 51.59406931320938, 0.05872984500197449], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 173.22222222222223, 101, 1174, 103.0, 389.20000000000124, 1174.0, 1174.0, 0.10571569525688915, 5.311531168877886, 0.06164454712570771], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/56e3159d-8a4a-4285-a9cf-42e743925ba2", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 1.4449589932126696, 2.699908088235294], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 990.6551724137929, 684, 1364, 986.0, 1242.4, 1312.45, 1364.0, 0.2573637081673042, 231.57631700608354, 0.12918451757616634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 475.23529411764713, 100, 919, 598.0, 891.8, 919.0, 919.0, 0.10827749611474867, 16.868710848927417, 0.058834836612443], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 134.3125, 104, 322, 107.5, 310.1, 322.0, 322.0, 0.08564164324902984, 0.06398032918506624, 0.03044292787367858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 146.11111111111111, 100, 489, 102.5, 325.2000000000003, 489.0, 489.0, 0.10571569525688915, 1.7537953953473349, 0.061747785109357016], "isController": false}, {"data": ["deleteBooks", 12, 2, 16.666666666666668, 496.83333333333326, 107, 1276, 417.0, 1151.8000000000004, 1276.0, 1276.0, 0.07265461810916357, 0.014509638089183544, 0.049228706899161444], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=03969dbf-dcea-4ec7-a15d-c9fbdef9234e", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 0.8287342316513762, 3.162629013761468], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 20, 11.363636363636363, 178.85795454545462, 99, 2423, 108.0, 294.0, 345.9000000000005, 2187.379999999997, 0.7330004289718419, 1.610442093486708, 0.3493774572173471], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 15, 0, 0.0, 107.26666666666665, 103, 115, 105.0, 114.4, 115.0, 115.0, 0.08324176738920522, 0.06446359525355443, 0.029589847001631538], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/03969dbf-dcea-4ec7-a15d-c9fbdef9234e", 3, 0, 0.0, 306.0, 185, 415, 318.0, 415.0, 415.0, 415.0, 0.09203300917262325, 0.041642539957664815, 0.05901856382489186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d51b732-b6eb-4d9b-917b-f8f290303521", 3, 0, 0.0, 832.6666666666666, 195, 1584, 719.0, 1584.0, 1584.0, 1584.0, 0.026426595725938584, 0.02650401739310442, 0.016946742701855148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 243.1818181818182, 205, 409, 207.0, 408.4, 409.0, 409.0, 0.06709485382471164, 0.10398391896466541, 0.150897898787413], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e1ca726a-a0cb-4379-a57f-7f988870412f", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 129.1764705882353, 103, 430, 108.0, 185.1999999999998, 430.0, 430.0, 0.08483626600660725, 0.06884661821434632, 0.030156641432036172], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b963b4e-575b-45e0-a158-1af9714b0b5c", 3, 0, 0.0, 362.3333333333333, 219, 555, 313.0, 555.0, 555.0, 555.0, 0.03433830094086945, 0.028626428616395395, 0.022020329704919534], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 597.2857142857143, 144, 1860, 530.0, 1233.2000000000003, 1803.1999999999991, 1860.0, 0.09268249624856563, 0.056930947402683375, 0.04190624586238856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 103.70588235294117, 100, 110, 104.0, 106.8, 110.0, 110.0, 0.10827335838481625, 0.08046486887777848, 0.05434815059550348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 174.8823529411765, 99, 314, 104.0, 312.4, 314.0, 314.0, 0.10813630262898434, 0.11491966903930437, 0.05686349461544822], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f43e7d81-c163-45ff-bf0c-0a7e6a045925", 1, 0, 0.0, 378.0, 378, 378, 378.0, 378.0, 378.0, 378.0, 2.6455026455026456, 0.4779472552910053, 1.823950066137566], "isController": false}, {"data": ["login", 21, 0, 0.0, 2704.3809523809523, 1497, 4685, 2703.0, 3785.0, 4598.699999999999, 4685.0, 0.09241005421389847, 42.23888074647522, 0.19780238027397382], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=34d6292f-da0f-49ab-83d3-df168b0c344c", 1, 0, 0.0, 284.0, 284, 284, 284.0, 284.0, 284.0, 284.0, 3.5211267605633805, 0.6361410651408451, 2.4276518485915495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 15, 0, 0.0, 261.40000000000003, 204, 415, 209.0, 412.0, 415.0, 415.0, 0.08335602469561158, 0.1291855578046246, 0.18746965319725925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 143.94444444444446, 103, 309, 106.0, 309.0, 309.0, 309.0, 0.10733260585678253, 0.08689329126491475, 0.03815338723815316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 246.00000000000003, 204, 411, 208.5, 408.9, 411.0, 411.0, 0.08125374528982195, 0.1259274353270971, 0.1827415775414648], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/34d6292f-da0f-49ab-83d3-df168b0c344c", 3, 0, 0.0, 414.33333333333337, 186, 863, 194.0, 863.0, 863.0, 863.0, 0.0701803635342831, 0.03253152267995415, 0.04500498572999275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e4fa7879-c8ac-4d33-933a-013956edb9dd", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 1.4256068638392856, 2.6637486049107144], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 142.90909090909093, 103, 316, 105.0, 314.8, 316.0, 316.0, 0.06666262650748439, 0.055270087797709234, 0.023696480516332344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 770.0000000000001, 204, 1408, 1007.0, 1404.8, 1408.0, 1408.0, 0.10806275267614229, 68.52149395960996, 0.22839802729855832], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6b963b4e-575b-45e0-a158-1af9714b0b5c", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f43e7d81-c163-45ff-bf0c-0a7e6a045925", 3, 0, 0.0, 1086.3333333333333, 205, 2564, 490.0, 2564.0, 2564.0, 2564.0, 0.03502258957027283, 0.029196891891103093, 0.02245914760854084], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 119.47058823529412, 102, 310, 106.0, 157.19999999999987, 310.0, 310.0, 0.10946837008036267, 0.08498765059950031, 0.03891258467700392], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8525b353-1a13-45b0-b808-114e7bc94d27", 3, 0, 0.0, 343.6666666666667, 193, 540, 298.0, 540.0, 540.0, 540.0, 0.04384042086804034, 0.028185166410930874, 0.028113811559257632], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 376.70588235294116, 203, 1452, 399.0, 620.7999999999993, 1452.0, 1452.0, 0.0834269842126701, 5.992729737057776, 0.18637362069430882], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 3, 27.272727272727273, 932.8181818181818, 102, 1362, 1220.0, 1354.4, 1362.0, 1362.0, 0.059048989188666884, 51.381123564706954, 0.10741422127803485], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f7d1295b-f2cf-4971-97b8-33f6c467d283", 3, 0, 0.0, 833.3333333333334, 216, 1815, 469.0, 1815.0, 1815.0, 1815.0, 0.020356372223051554, 0.024060542819628973, 0.013054053801891785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 115.62500000000001, 100, 305, 103.0, 165.00000000000014, 305.0, 305.0, 0.0852283320282745, 0.06333863347023135, 0.042780627600129975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 152.9375, 100, 306, 104.0, 305.3, 306.0, 306.0, 0.08522924002152038, 0.03880677066409558, 0.04771256039290679], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 252.8125, 100, 1111, 103.0, 1108.9, 1111.0, 1111.0, 0.0852287860224791, 9.606226778485059, 0.04918966068289565], "isController": false}, {"data": ["register", 21, 8, 38.095238095238095, 1001.6190476190479, 383, 2172, 998.0, 1559.0000000000002, 2114.999999999999, 2172.0, 0.09408897232440086, 0.0292452888307429, 0.04245029806042304], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 226.9375, 99, 815, 103.0, 793.3000000000001, 815.0, 815.0, 0.0852287860224791, 3.1526119626591385, 0.04927289191924573], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 22.857142857142858, 0.6010518407212622], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 5.714285714285714, 0.15026296018031554], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 2.857142857142857, 0.07513148009015777], "isController": false}, {"data": ["401/Unauthorized", 24, 68.57142857142857, 1.8031555221637867], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1331, 35, "401/Unauthorized", 24, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 20, "401/Unauthorized", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
