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

    var data = {"OkPercent": 65.46052631578948, "KoPercent": 34.53947368421053};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5079268292682927, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9dc72ea2-b821-4cf4-964d-64549baf8adc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b6b1da54-d51d-4386-8c81-ab942e1eccaf"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9dc72ea2-b821-4cf4-964d-64549baf8adc"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=927b8674-8eec-4702-9cf1-6aaaf30812c9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4523809523809524, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=040552e5-ea9d-4d2f-99dd-325b9ea41505"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6cf669df-d3d6-40f0-bf2d-f1604c652643"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fd5262d3-057d-417b-8a34-6939e9299fed"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4a6c261c-e713-4ffa-a874-0e22bff00d60"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd5262d3-057d-417b-8a34-6939e9299fed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/040552e5-ea9d-4d2f-99dd-325b9ea41505"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ae778dee-f451-42b3-9a4b-57cfc81c2401"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9189944134078212, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6cf669df-d3d6-40f0-bf2d-f1604c652643"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae778dee-f451-42b3-9a4b-57cfc81c2401"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5c7052b4-2ae2-4cad-af91-d9000945493e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f3e4b788-4726-4515-85ad-40442405735c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/927b8674-8eec-4702-9cf1-6aaaf30812c9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/70ac7221-3795-4fa0-bfb4-2b967645f0f5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b6b1da54-d51d-4386-8c81-ab942e1eccaf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9f6ef1d0-300d-47f7-997f-a44221f1d152"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f3e4b788-4726-4515-85ad-40442405735c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5c7052b4-2ae2-4cad-af91-d9000945493e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=70ac7221-3795-4fa0-bfb4-2b967645f0f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f1dbe4fb-0257-4b5d-86f7-3bb7057ee67e"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9f6ef1d0-300d-47f7-997f-a44221f1d152"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f1dbe4fb-0257-4b5d-86f7-3bb7057ee67e"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 608, 210, 34.53947368421053, 242.73190789473682, 98, 1556, 106.0, 496.1, 922.5999999999995, 1318.389999999999, 2.4149600419440427, 2.554933327938069, 1.1522253665635278], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 57, 100.0, 564.2280701754387, 400, 1024, 605.0, 730.6, 744.5999999999999, 1024.0, 0.2593030661450278, 1.6686282029046493, 0.4352948932649441], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 23, 23, 100.0, 155.43478260869563, 100, 326, 103.0, 308.8, 322.79999999999995, 326.0, 0.14346486358362753, 0.07131212457428361, 0.07201263660350053], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 190.91666666666669, 101, 310, 121.5, 309.7, 310.0, 310.0, 0.12539053928381103, 0.09734910032288065, 0.044572418261042204], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9dc72ea2-b821-4cf4-964d-64549baf8adc", 3, 0, 0.0, 464.3333333333333, 243, 784, 366.0, 784.0, 784.0, 784.0, 0.0199008935501204, 0.027434988341393192, 0.012761966241450907], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b6b1da54-d51d-4386-8c81-ab942e1eccaf", 1, 0, 0.0, 626.0, 626, 626, 626.0, 626.0, 626.0, 626.0, 1.5974440894568689, 0.2886007388178914, 1.1013628194888179], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 18, 100.0, 103.77777777777776, 100, 123, 102.0, 111.30000000000001, 123.0, 123.0, 0.09071346137370419, 0.04509096859298382, 0.04553390541609761], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9dc72ea2-b821-4cf4-964d-64549baf8adc", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 104.0, 104, 104, 104.0, 104.0, 104.0, 104.0, 9.615384615384617, 2.8357872596153846, 5.943885216346154], "isController": false}, {"data": ["https://demoqa.com/books", 57, 57, 100.0, 174.71929824561406, 98, 704, 102.0, 401.4, 414.79999999999995, 704.0, 0.24949335340952364, 0.12401573914594487, 0.12060469720479904], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 491.53846153846155, 104, 800, 478.0, 758.0, 800.0, 800.0, 0.07810622446527277, 0.01479746830689738, 0.05280032406572939], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 491.53846153846155, 104, 800, 478.0, 758.0, 800.0, 800.0, 0.07800358816505559, 0.014778023539082799, 0.05273094124829743], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 9, 40.90909090909091, 780.9545454545455, 260, 1321, 907.0, 1216.1, 1308.5499999999997, 1321.0, 0.08978052741978926, 0.027817297646933994, 0.04050644889447523], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=927b8674-8eec-4702-9cf1-6aaaf30812c9", 1, 0, 0.0, 716.0, 716, 716, 716.0, 716.0, 716.0, 716.0, 1.3966480446927374, 0.2523241096368715, 0.9629233589385475], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 152.99999999999997, 101, 298, 105.0, 298.0, 298.0, 298.0, 0.04045614301246555, 0.03184340944145238, 0.014380894586462363], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 483.9166666666667, 99, 981, 399.0, 915.3000000000002, 981.0, 981.0, 0.07701045416915346, 0.01594357058970755, 0.05187300855778672], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1155.3809523809523, 751, 1556, 1161.0, 1529.4, 1555.2, 1556.0, 0.10671165494532298, 0.05523161828224724, 0.04908319285082727], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 251.76923076923075, 99, 784, 191.0, 626.7999999999998, 784.0, 784.0, 0.07826563356030368, 0.1786257871716606, 0.05008600753457234], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 8, 100.0, 101.125, 100, 106, 100.5, 106.0, 106.0, 106.0, 0.04022485695035247, 0.0199945822145795, 0.02019099264890739], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=040552e5-ea9d-4d2f-99dd-325b9ea41505", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6cf669df-d3d6-40f0-bf2d-f1604c652643", 3, 0, 0.0, 264.3333333333333, 191, 407, 195.0, 407.0, 407.0, 407.0, 0.046078702423739744, 0.02962416578349154, 0.029549167895432066], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd5262d3-057d-417b-8a34-6939e9299fed", 3, 0, 0.0, 290.0, 217, 366, 287.0, 366.0, 366.0, 366.0, 0.02019413293124571, 0.023868781469190487, 0.012950013631039729], "isController": false}, {"data": ["addBook", 61, 61, 100.0, 621.7377049180327, 403, 1343, 621.0, 770.8000000000001, 830.0, 1343.0, 0.29527654342501425, 0.9712633676168761, 0.5759887453046189], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4a6c261c-e713-4ffa-a874-0e22bff00d60", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 1.237736191860465, 2.3127119670542635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd5262d3-057d-417b-8a34-6939e9299fed", 1, 0, 0.0, 669.0, 669, 669, 669.0, 669.0, 669.0, 669.0, 1.4947683109118086, 0.2700509155455904, 1.030572683109118], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/040552e5-ea9d-4d2f-99dd-325b9ea41505", 3, 0, 0.0, 259.3333333333333, 186, 394, 198.0, 394.0, 394.0, 394.0, 0.0275148580233326, 0.027595467958947833, 0.017644619240223054], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 135.44444444444443, 103, 420, 104.5, 326.40000000000015, 420.0, 420.0, 0.08940145724375306, 0.066789174601046, 0.03177942425461535], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae778dee-f451-42b3-9a4b-57cfc81c2401", 3, 0, 0.0, 381.0, 197, 706, 240.0, 706.0, 706.0, 706.0, 0.05114827886041635, 0.03288341495746168, 0.03280016580567064], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 438.30769230769226, 104, 716, 403.0, 697.1999999999999, 716.0, 716.0, 0.07802606070427523, 0.014782281031864644, 0.053367434097988733], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 14, 7.82122905027933, 162.88268156424581, 100, 1012, 106.0, 306.0, 387.0, 574.3999999999937, 0.7309523615069868, 1.5816471427010936, 0.3509724614208244], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 138.2857142857143, 101, 373, 104.5, 336.0, 373.0, 373.0, 0.07783702039885913, 0.06027808317997587, 0.027668628344906958], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6cf669df-d3d6-40f0-bf2d-f1604c652643", 1, 0, 0.0, 392.0, 392, 392, 392.0, 392.0, 392.0, 392.0, 2.5510204081632653, 0.46087771045918363, 1.7588089923469388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 14, 100.0, 129.42857142857142, 99, 311, 100.5, 303.5, 311.0, 311.0, 0.07014906676687961, 0.03486901853939622, 0.035211543279468877], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae778dee-f451-42b3-9a4b-57cfc81c2401", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5c7052b4-2ae2-4cad-af91-d9000945493e", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 106.0, 102, 116, 105.0, 114.5, 116.0, 116.0, 0.08811737233995683, 0.07150931290478918, 0.031322972198969026], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 484.19047619047626, 109, 1292, 414.0, 862.4000000000001, 1252.2999999999995, 1292.0, 0.1063441905687895, 0.06532274987086777, 0.048083359602880404], "isController": false}, {"data": ["login", 21, 8, 38.095238095238095, 1864.047619047619, 1345, 2609, 1724.0, 2519.4, 2603.4, 2609.0, 0.10620865448807429, 0.1613182232556493, 0.15882401889755418], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 14, 100.0, 102.35714285714286, 100, 110, 101.0, 109.0, 110.0, 110.0, 0.07655000082017858, 0.03805073282956142, 0.0384245121304412], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 23, 0, 0.0, 142.04347826086956, 101, 372, 105.0, 298.6, 357.3999999999998, 372.0, 0.13530685240963855, 0.10954041078866246, 0.048097357692488706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 12, 100.0, 134.0, 100, 301, 101.5, 299.2, 301.0, 301.0, 0.12374068077997875, 0.06150781886426678, 0.06211202140713777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f3e4b788-4726-4515-85ad-40442405735c", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.45279213659147866, 1.727952694235589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/927b8674-8eec-4702-9cf1-6aaaf30812c9", 3, 0, 0.0, 412.0, 193, 762, 281.0, 762.0, 762.0, 762.0, 0.029786431287667423, 0.024831722176990974, 0.01910132475153152], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70ac7221-3795-4fa0-bfb4-2b967645f0f5", 2, 0, 0.0, 213.0, 190, 236, 213.0, 236.0, 236.0, 236.0, 0.015041326043303977, 0.02956119986538013, 0.00934941799469041], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b6b1da54-d51d-4386-8c81-ab942e1eccaf", 3, 0, 0.0, 487.66666666666663, 186, 981, 296.0, 981.0, 981.0, 981.0, 0.02340330922792483, 0.023471873610428514, 0.015007981503584605], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 132.35714285714286, 100, 311, 103.0, 305.5, 311.0, 311.0, 0.0730593607305936, 0.0605736301369863, 0.025970319634703195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 15, 100.0, 116.93333333333334, 100, 306, 103.0, 191.40000000000006, 306.0, 306.0, 0.0721844456956415, 0.035880744979571805, 0.036233208093320056], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 133.13333333333335, 101, 299, 107.0, 297.8, 299.0, 299.0, 0.07050992779783394, 0.0547415943352324, 0.025064075896886282], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9f6ef1d0-300d-47f7-997f-a44221f1d152", 3, 0, 0.0, 610.0, 391, 830, 609.0, 830.0, 830.0, 830.0, 0.020779652564209126, 0.028646428583797408, 0.013325493343584627], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3e4b788-4726-4515-85ad-40442405735c", 3, 0, 0.0, 297.6666666666667, 203, 404, 286.0, 404.0, 404.0, 404.0, 0.028652200488997553, 0.023289239785490527, 0.018373969714624083], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c7052b4-2ae2-4cad-af91-d9000945493e", 3, 0, 0.0, 257.0, 180, 360, 231.0, 360.0, 360.0, 360.0, 0.05443855701531538, 0.03499874677905204, 0.034910142356826594], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=70ac7221-3795-4fa0-bfb4-2b967645f0f5", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f1dbe4fb-0257-4b5d-86f7-3bb7057ee67e", 1, 0, 0.0, 365.0, 365, 365, 365.0, 365.0, 365.0, 365.0, 2.73972602739726, 0.4949700342465754, 1.8889126712328768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 14, 100.0, 115.92857142857144, 99, 298, 102.0, 201.5, 298.0, 298.0, 0.08547947881940629, 0.04248931124909941, 0.042906691516772295], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 10, 100.0, 121.4, 99, 299, 102.0, 279.70000000000005, 299.0, 299.0, 0.1512653345232873, 0.07518950710190746, 0.0854560508024626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9f6ef1d0-300d-47f7-997f-a44221f1d152", 1, 0, 0.0, 344.0, 344, 344, 344.0, 344.0, 344.0, 344.0, 2.9069767441860463, 0.5251862281976745, 2.0042242005813957], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f1dbe4fb-0257-4b5d-86f7-3bb7057ee67e", 3, 0, 0.0, 242.0, 173, 353, 200.0, 353.0, 353.0, 353.0, 0.038328371938521295, 0.03195278663234148, 0.024579066640262676], "isController": false}, {"data": ["register", 22, 9, 40.90909090909091, 780.9545454545455, 260, 1321, 907.0, 1216.1, 1308.5499999999997, 1321.0, 0.0886860754799126, 0.027478196326784, 0.04001266296066369], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 4.285714285714286, 1.480263157894737], "isController": false}, {"data": ["401/Unauthorized", 16, 7.619047619047619, 2.6315789473684212], "isController": false}, {"data": ["404/Not Found", 185, 88.0952380952381, 30.42763157894737], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 608, 210, "404/Not Found", 185, "401/Unauthorized", 16, "406/Not Acceptable", 9, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 23, 23, "404/Not Found", 23, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 18, "404/Not Found", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 57, 57, "404/Not Found", 57, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 8, "404/Not Found", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 12, "404/Not Found", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 10, "404/Not Found", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
