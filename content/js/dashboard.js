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

    var data = {"OkPercent": 99.42279942279943, "KoPercent": 0.5772005772005772};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8405977584059776, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.47580645161290325, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7387c74f-d5c1-4ad6-bb6f-87ffee86623d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5216bc73-1339-4654-9dbf-2e832e3993b2"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a7c43bbd-eb91-4af5-99ad-a8fcbe8d1b3f"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7e727e14-ac62-4bec-a529-7bddda9923ed"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d397690d-0aa2-40bb-a88f-dcea35146ff1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/191e835b-13d9-457e-a76c-6db16b888ed0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/69fd4418-f5e7-4c97-b9b7-b7025bdaf7b3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f21283be-52f9-49fc-a3be-f74af96befcf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e4f634c0-7c01-4981-918c-e4d3cb432e1e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9c94c062-cff3-4aef-9047-036e1a6577e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f105edcf-41d3-4779-be71-638c26493f5f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d19b3a83-9855-47ee-b2e8-ab9ed40ddde0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dae0dafc-5cfa-45b7-b539-d677e5870e3e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/19107f9d-88ac-4386-a3ef-9cb0dc78be02"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9ce87ec3-ce4a-4fbb-9195-6a4c853658a2"], "isController": false}, {"data": [0.4318181818181818, 500, 1500, "register"], "isController": true}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=156edda3-d501-42be-ad6d-e5129f5a3d5c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=69fd4418-f5e7-4c97-b9b7-b7025bdaf7b3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=191e835b-13d9-457e-a76c-6db16b888ed0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.4318181818181818, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7c43bbd-eb91-4af5-99ad-a8fcbe8d1b3f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d397690d-0aa2-40bb-a88f-dcea35146ff1"], "isController": false}, {"data": [0.45454545454545453, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fee9884a-40ef-4508-8503-578c1a493729"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f21283be-52f9-49fc-a3be-f74af96befcf"], "isController": false}, {"data": [0.4583333333333333, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8387096774193549, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9725274725274725, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7387c74f-d5c1-4ad6-bb6f-87ffee86623d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fee9884a-40ef-4508-8503-578c1a493729"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e727e14-ac62-4bec-a529-7bddda9923ed"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9c94c062-cff3-4aef-9047-036e1a6577e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dae0dafc-5cfa-45b7-b539-d677e5870e3e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e4f634c0-7c01-4981-918c-e4d3cb432e1e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/156edda3-d501-42be-ad6d-e5129f5a3d5c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d19b3a83-9855-47ee-b2e8-ab9ed40ddde0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5216bc73-1339-4654-9dbf-2e832e3993b2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1386, 8, 0.5772005772005772, 270.3477633477635, 80, 2513, 90.0, 657.3, 816.0, 1222.1299999999999, 5.425761798878832, 780.9588563217857, 3.9731170519538224], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 62, 0, 0.0, 1194.483870967742, 977, 1525, 1157.5, 1418.3, 1506.2499999999998, 1525.0, 0.26903183254070195, 323.736134317668, 1.3228274187914397], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7387c74f-d5c1-4ad6-bb6f-87ffee86623d", 3, 0, 0.0, 395.3333333333333, 215, 518, 453.0, 518.0, 518.0, 518.0, 0.01727523479923298, 0.023815305786051975, 0.01107819419091438], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5216bc73-1339-4654-9dbf-2e832e3993b2", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 661.9285714285716, 407, 1451, 571.5, 1259.5, 1451.0, 1451.0, 0.10192640913260625, 0.018414439149933747, 0.06927810620731831], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 661.9285714285716, 407, 1451, 571.5, 1259.5, 1451.0, 1451.0, 0.09966398997665014, 0.018005701314140896, 0.0677403681872544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 106.1904761904762, 81, 245, 83.0, 244.6, 245.0, 245.0, 0.1250982915147616, 0.04242079342102128, 0.07084481929253938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 84.09523809523809, 81, 92, 83.0, 90.0, 91.9, 92.0, 0.12509754630098469, 0.09296800071782163, 0.06279310429561145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 125.23809523809524, 81, 483, 83.0, 247.2, 459.49999999999966, 483.0, 0.12509903673741712, 1.7836967845079736, 0.07315477990015906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 137.14285714285714, 81, 730, 83.0, 245.0, 681.4999999999993, 730.0, 0.1250982915147616, 5.3922866943818955, 0.07303217781232874], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7c43bbd-eb91-4af5-99ad-a8fcbe8d1b3f", 3, 0, 0.0, 351.0, 177, 667, 209.0, 667.0, 667.0, 667.0, 0.020469851320646573, 0.024194671271246002, 0.013126825228409425], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e727e14-ac62-4bec-a529-7bddda9923ed", 3, 0, 0.0, 943.0, 212, 2218, 399.0, 2218.0, 2218.0, 2218.0, 0.016172158012765222, 0.022294625385436435, 0.01037081747563395], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 218.50000000000003, 175, 453, 181.5, 415.5, 453.0, 453.0, 0.10159209323251528, 0.25174798493897216, 0.06567770089836436], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d397690d-0aa2-40bb-a88f-dcea35146ff1", 3, 0, 0.0, 268.6666666666667, 180, 438, 188.0, 438.0, 438.0, 438.0, 0.05306541196448155, 0.034115946819612976, 0.034029577333993706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 91.89473684210525, 82, 245, 84.0, 86.0, 245.0, 245.0, 0.08783040411231198, 0.06527239993112248, 0.044086745814187846], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/191e835b-13d9-457e-a76c-6db16b888ed0", 3, 0, 0.0, 615.0, 181, 993, 671.0, 993.0, 993.0, 993.0, 0.020654897964804055, 0.028474444297182672, 0.013245491207898433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 99.36842105263158, 81, 245, 82.0, 243.0, 245.0, 245.0, 0.08783121613875483, 0.023501712130877758, 0.050091240454133615], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 524.0, 404, 676, 566.0, 676.0, 676.0, 676.0, 0.08064125929390513, 23.7112077742206, 0.04599071819105527], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 597.2, 560, 730, 565.0, 730.0, 730.0, 730.0, 0.08021948049864429, 72.1816295634857, 0.04567183313545861], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 266.6, 243, 351, 245.0, 351.0, 351.0, 351.0, 0.08084205080114473, 0.14305253520671313, 0.04476312773852447], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69fd4418-f5e7-4c97-b9b7-b7025bdaf7b3", 2, 0, 0.0, 178.0, 175, 181, 178.0, 181.0, 181.0, 181.0, 0.041084634346754315, 0.036310150472473296, 0.025537470470419064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 110.6153846153846, 83, 267, 84.0, 260.2, 267.0, 267.0, 0.061105157275274026, 0.04541115692039408, 0.030671924647940288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 110.23076923076923, 81, 279, 83.0, 265.8, 279.0, 279.0, 0.06105895006786937, 0.030446913352653013, 0.03403375972833464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 196.69230769230768, 81, 763, 83.0, 683.4, 763.0, 763.0, 0.06096788868201494, 8.453752852007485, 0.03503638434626009], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 181.76923076923077, 81, 567, 83.0, 501.4, 567.0, 567.0, 0.060967030905594896, 2.7718015757632606, 0.03509542952445716], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f21283be-52f9-49fc-a3be-f74af96befcf", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.43324715227817745, 1.6533648081534773], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 83.8, 82, 89, 83.0, 89.0, 89.0, 89.0, 0.08106092539152428, 0.06024156662397458, 0.04551760947277974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 398.95, 81, 1137, 328.5, 739.0, 1117.1499999999996, 1137.0, 0.09049323336847487, 40.72518060469841, 0.04931174240196189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 100.05263157894736, 81, 245, 83.0, 245.0, 245.0, 245.0, 0.08783081012365652, 0.023673148041141803, 0.05163490985785277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 288.15000000000003, 81, 579, 248.0, 570.6, 578.6, 579.0, 0.09049282391906323, 13.316142760347855, 0.04939989118237924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 113.6842105263158, 81, 330, 83.0, 249.0, 330.0, 330.0, 0.08783040411231198, 0.023673038608396587, 0.051720443046605585], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 481.71428571428567, 207, 960, 448.0, 762.5, 960.0, 960.0, 0.10011370055992162, 0.018086947855063963, 0.0690237037063522], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 321.3846153846154, 166, 847, 169.0, 841.8, 847.0, 847.0, 0.06094273726648384, 11.296641886705107, 0.13466275666268196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 527.2272727272727, 131, 1494, 423.5, 1236.8999999999996, 1478.2499999999998, 1494.0, 0.08953462344586208, 0.05499734194086645, 0.0404829400931974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 83.45, 82, 85, 83.5, 84.9, 85.0, 85.0, 0.09049405227841399, 0.06725192752331353, 0.045423772335063284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 157.95, 82, 253, 92.0, 250.0, 252.85, 253.0, 0.09049200503135547, 0.09217105590596071, 0.0478087643769173], "isController": false}, {"data": ["login", 22, 0, 0.0, 2085.0454545454545, 1273, 2915, 2033.5, 2800.9, 2904.95, 2915.0, 0.09217593872813963, 25.18945248670781, 0.17381187309887125], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e4f634c0-7c01-4981-918c-e4d3cb432e1e", 1, 0, 0.0, 392.0, 392, 392, 392.0, 392.0, 392.0, 392.0, 2.5510204081632653, 0.46087771045918363, 1.7588089923469388], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 94.21052631578947, 82, 248, 85.0, 100.0, 248.0, 248.0, 0.08891135070380354, 0.07197998997407533, 0.03160520669549266], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9c94c062-cff3-4aef-9047-036e1a6577e3", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 0.8727732487922706, 3.330691425120773], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f105edcf-41d3-4779-be71-638c26493f5f", 1, 0, 0.0, 317.0, 317, 317, 317.0, 317.0, 317.0, 317.0, 3.1545741324921135, 1.0073688880126184, 1.882270307570978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d19b3a83-9855-47ee-b2e8-ab9ed40ddde0", 3, 0, 0.0, 373.0, 176, 734, 209.0, 734.0, 734.0, 734.0, 0.03758315272540496, 0.03133152803703194, 0.02410117541310149], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 484.8999999999999, 166, 1222, 415.0, 825.8000000000001, 1202.2499999999998, 1222.0, 0.09045721599826323, 54.17923468389726, 0.19186823549631613], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dae0dafc-5cfa-45b7-b539-d677e5870e3e", 1, 0, 0.0, 960.0, 960, 960, 960.0, 960.0, 960.0, 960.0, 1.0416666666666667, 0.18819173177083334, 0.7181803385416667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19107f9d-88ac-4386-a3ef-9cb0dc78be02", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 1.1871224442379182, 2.218140102230483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 245.95238095238096, 165, 812, 175.0, 333.2, 764.1999999999994, 812.0, 0.12503498002417343, 7.307661964954481, 0.2796832019225617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 0, 0.0, 705.6, 650, 812, 654.0, 812.0, 812.0, 812.0, 0.0801127988207396, 95.84275910481959, 0.180644973122156], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ce87ec3-ce4a-4fbb-9195-6a4c853658a2", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 1.557736280487805, 2.9106326219512195], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 760.9999999999999, 263, 1345, 699.5, 1305.0, 1341.7, 1345.0, 0.09680456917566509, 0.03061238240444949, 0.043675498983552025], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 223.5263157894737, 165, 576, 168.0, 333.0, 576.0, 576.0, 0.08779671825108937, 0.13606776549265512, 0.19745687708228402], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 94.37499999999999, 82, 249, 84.0, 134.90000000000012, 249.0, 249.0, 0.10112245929821012, 0.07850815931843463, 0.03594587420366063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 317.4375, 166, 815, 327.0, 595.2000000000003, 815.0, 815.0, 0.08677542519958348, 6.614428185539418, 0.19377232094433358], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=156edda3-d501-42be-ad6d-e5129f5a3d5c", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.3787506551362684, 1.445394392033543], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=69fd4418-f5e7-4c97-b9b7-b7025bdaf7b3", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 101.22222222222223, 82, 248, 83.0, 248.0, 248.0, 248.0, 0.05347053476475935, 0.03973737983982604, 0.026839702020592097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 119.11111111111111, 81, 245, 83.0, 245.0, 245.0, 245.0, 0.053471487814442054, 0.014307800450348754, 0.030495457894173985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 82.55555555555556, 81, 84, 82.0, 84.0, 84.0, 84.0, 0.053470852444212076, 0.014412065697854037, 0.031435012862710617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=191e835b-13d9-457e-a76c-6db16b888ed0", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.43324715227817745, 1.6533648081534773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 118.66666666666667, 81, 245, 82.0, 245.0, 245.0, 245.0, 0.053470852444212076, 0.014412065697854037, 0.03148723049205067], "isController": false}, {"data": ["https://demoqa.com/books", 62, 0, 0.0, 789.2741935483871, 642, 1179, 655.0, 1064.7, 1136.1499999999999, 1179.0, 0.2601871668974779, 311.2743073041252, 0.5137680190104494], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 760.9999999999999, 263, 1345, 699.5, 1305.0, 1341.7, 1345.0, 0.09258869576196288, 0.029279202264214467, 0.041773415470729346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 85.875, 81, 111, 82.5, 111.0, 111.0, 111.0, 0.05425273637239078, 0.014622807850370954, 0.031947656281788715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 106.375, 82, 244, 82.5, 244.0, 244.0, 244.0, 0.05425236845496036, 0.014622708685126034, 0.03189445879871693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 182.75, 81, 727, 83.0, 724.2, 727.0, 727.0, 0.10487745724604906, 11.82084933124234, 0.06052986057853028], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 152.75, 81, 563, 82.5, 451.0000000000001, 563.0, 563.0, 0.1048767697954903, 3.879390690547981, 0.06063188253801783], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7c43bbd-eb91-4af5-99ad-a8fcbe8d1b3f", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 82.875, 81, 85, 83.0, 84.3, 85.0, 85.0, 0.1048767697954903, 0.07794064630309386, 0.05264322233875197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 86.24999999999999, 81, 111, 82.5, 111.0, 111.0, 111.0, 0.05425236845496036, 0.01451674702798744, 0.03094080388446958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 102.8125, 81, 246, 82.0, 245.3, 246.0, 246.0, 0.104875394921409, 0.04775210242393256, 0.05871076185419698], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 83.625, 82, 86, 83.5, 86.0, 86.0, 86.0, 0.05425200054252, 0.04031813712193137, 0.027231961209819612], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 107.125, 83, 253, 86.0, 253.0, 253.0, 253.0, 0.05312084993359894, 0.041811918990703856, 0.018882802124833998], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 721.2499999999999, 396, 2218, 649.0, 1787.2000000000016, 2218.0, 2218.0, 0.11331979791302706, 0.02047281505264649, 0.07713271400916002], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d397690d-0aa2-40bb-a88f-dcea35146ff1", 1, 0, 0.0, 537.0, 537, 537, 537.0, 537.0, 537.0, 537.0, 1.86219739292365, 0.33643214618249534, 1.2838978119180633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1147.2272727272727, 754, 2513, 1105.5, 1502.6999999999998, 2365.549999999998, 2513.0, 0.08971060175425005, 0.046432245048586444, 0.04126337248657399], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 191.125, 165, 327, 167.5, 327.0, 327.0, 327.0, 0.05422148119531255, 0.08403270571968849, 0.12194538202422345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fee9884a-40ef-4508-8503-578c1a493729", 1, 0, 0.0, 529.0, 529, 529, 529.0, 529.0, 529.0, 529.0, 1.890359168241966, 0.34151996691871456, 1.303314035916824], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f21283be-52f9-49fc-a3be-f74af96befcf", 3, 0, 0.0, 342.33333333333337, 183, 631, 213.0, 631.0, 631.0, 631.0, 0.03272643969062606, 0.03282231793190719, 0.02098668170264757], "isController": false}, {"data": ["addBook", 60, 3, 5.0, 827.65, 438, 1577, 703.0, 1289.3, 1457.1499999999996, 1577.0, 0.28481237984477725, 91.92492931609428, 1.0361811851755156], "isController": true}, {"data": ["https://demoqa.com/books-0", 62, 0, 0.0, 156.54838709677418, 81, 384, 85.0, 330.0, 331.85, 384.0, 0.2609801065809081, 0.1939510362383506, 0.1261573757397944], "isController": false}, {"data": ["https://demoqa.com/books-3", 62, 0, 0.0, 471.45161290322585, 402, 657, 407.5, 646.7, 654.85, 657.0, 0.26075290297889164, 76.67001128702586, 0.13114037600989178], "isController": false}, {"data": ["https://demoqa.com/books-1", 62, 0, 0.0, 119.83870967741932, 80, 346, 84.0, 246.0, 250.39999999999998, 346.0, 0.2612869647304741, 0.4623554493082217, 0.12707119964431257], "isController": false}, {"data": ["https://demoqa.com/books-2", 62, 0, 0.0, 631.1612903225805, 558, 821, 569.0, 736.4, 813.55, 821.0, 0.2605819383093276, 234.47208614492138, 0.1307999182529242], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 85.75, 83, 92, 85.0, 90.6, 92.0, 92.0, 0.08658149212378988, 0.064682462377636, 0.030777014778378436], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 3, 1.6483516483516483, 147.2802197802198, 82, 1122, 86.0, 249.80000000000007, 291.94999999999993, 1053.939999999999, 0.7586083288525424, 1.6528167567514056, 0.36288382403204494], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 84.55555555555554, 83, 85, 85.0, 85.0, 85.0, 85.0, 0.05227938101212881, 0.04048588783458804, 0.01858368621915517], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7387c74f-d5c1-4ad6-bb6f-87ffee86623d", 1, 0, 0.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 396.0, 2.5252525252525255, 0.456222380050505, 1.7410432449494948], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 92.52380952380955, 83, 246, 85.0, 86.8, 230.09999999999977, 246.0, 0.12604890697590665, 0.1022916422822055, 0.044806447401591815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 221.88888888888886, 165, 493, 168.0, 493.0, 493.0, 493.0, 0.05344418052256532, 0.08282804149346792, 0.1201972145932304], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fee9884a-40ef-4508-8503-578c1a493729", 2, 0, 0.0, 210.5, 182, 239, 210.5, 239.0, 239.0, 239.0, 0.0272186611140598, 0.022939164591243757, 0.01691863066318268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 277.375, 166, 809, 168.0, 807.6, 809.0, 809.0, 0.10481836941924072, 15.817043323561203, 0.23238662419338987], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e727e14-ac62-4bec-a529-7bddda9923ed", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 0.3514865029182879, 1.3413484922178989], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9c94c062-cff3-4aef-9047-036e1a6577e3", 3, 0, 0.0, 439.33333333333337, 180, 782, 356.0, 782.0, 782.0, 782.0, 0.07035647279549719, 0.03183447174015009, 0.04511792037992495], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dae0dafc-5cfa-45b7-b539-d677e5870e3e", 3, 0, 0.0, 293.3333333333333, 184, 446, 250.0, 446.0, 446.0, 446.0, 0.01745413924912293, 0.024061940013032426, 0.011192921328376359], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e4f634c0-7c01-4981-918c-e4d3cb432e1e", 3, 0, 0.0, 434.33333333333337, 184, 741, 378.0, 741.0, 741.0, 741.0, 0.043981820847383085, 0.03574954643747252, 0.028204487978302304], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/156edda3-d501-42be-ad6d-e5129f5a3d5c", 3, 0, 0.0, 495.3333333333333, 181, 892, 413.0, 892.0, 892.0, 892.0, 0.027709274294106235, 0.027790453808639752, 0.017769293736780368], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 86.23076923076923, 83, 94, 86.0, 91.6, 94.0, 94.0, 0.061571105153975125, 0.05104869948801258, 0.021886603785202095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d19b3a83-9855-47ee-b2e8-ab9ed40ddde0", 1, 0, 0.0, 565.0, 565, 565, 565.0, 565.0, 565.0, 565.0, 1.7699115044247788, 0.3197594026548673, 1.2202710176991152], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 114.60000000000001, 83, 247, 85.0, 246.8, 247.0, 247.0, 0.09179954651024023, 0.07127015573793065, 0.03263187004856196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5216bc73-1339-4654-9dbf-2e832e3993b2", 3, 0, 0.0, 266.3333333333333, 179, 396, 224.0, 396.0, 396.0, 396.0, 0.025821333585808594, 0.030519942138694987, 0.01655860259246189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 106.31250000000001, 80, 248, 83.5, 246.6, 248.0, 248.0, 0.08681591769851002, 0.06451847008649035, 0.04357752118850991], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 123.37500000000001, 81, 254, 82.5, 248.4, 254.0, 254.0, 0.08683523556771248, 0.031386612855956626, 0.04906742009801527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 169.0, 81, 730, 83.0, 451.4000000000003, 730.0, 730.0, 0.08683617812271037, 4.905401354440857, 0.05058376977558275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 176.25, 82, 419, 165.0, 306.3000000000001, 419.0, 419.0, 0.0868357068426537, 1.6177284423573723, 0.05066829574070858], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 62.5, 0.36075036075036077], "isController": false}, {"data": ["401/Unauthorized", 3, 37.5, 0.21645021645021645], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1386, 8, "406/Not Acceptable", 5, "401/Unauthorized", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
