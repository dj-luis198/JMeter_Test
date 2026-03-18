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

    var data = {"OkPercent": 99.0453460620525, "KoPercent": 0.954653937947494};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7934931506849315, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=34a2bef1-74eb-440f-884d-497cc7433108"], "isController": false}, {"data": [0.10185185185185185, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2c2d5185-f818-4886-a5d2-f58b15af1589"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0c11dd16-7309-4fdc-9663-f8df07aa9914"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=65d84451-25d2-4a4d-8137-ae1e83e8084d"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7154e535-1b60-4d2f-93d7-b207f1949dc8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7365eeef-d7f5-47cc-af00-1c36dbb07502"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3d36aecf-6fb5-45e3-ac44-364fbbc5a32e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a98d4269-3a92-40ac-ae9e-478c4621354d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c772b069-3f47-4116-8230-3db703f9d9be"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c5b4a7e5-adf1-49eb-8899-d4522c1088a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a21755bb-6cc3-466e-9203-0c8464460013"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e917d024-3a91-457b-8460-98ab55feaca5"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c772b069-3f47-4116-8230-3db703f9d9be"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7aeb23a7-1798-4aa9-8423-c094caadd8ea"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0161a1eb-054b-438e-a4d2-f05907167bea"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c6b4a12e-8c5f-406e-b240-46097f537fad"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c8b00c55-d550-47ee-964a-4ce65039bb6f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c6b4a12e-8c5f-406e-b240-46097f537fad"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a21755bb-6cc3-466e-9203-0c8464460013"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c11dd16-7309-4fdc-9663-f8df07aa9914"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/234a3264-8532-4885-a710-7335ebf72d39"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.47619047619047616, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3103448275862069, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7aeb23a7-1798-4aa9-8423-c094caadd8ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/34a2bef1-74eb-440f-884d-497cc7433108"], "isController": false}, {"data": [0.9814814814814815, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9588235294117647, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a98d4269-3a92-40ac-ae9e-478c4621354d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e917d024-3a91-457b-8460-98ab55feaca5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7154e535-1b60-4d2f-93d7-b207f1949dc8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7365eeef-d7f5-47cc-af00-1c36dbb07502"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/35955cfd-aa57-4933-8268-5c154de2c124"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/65d84451-25d2-4a4d-8137-ae1e83e8084d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1257, 12, 0.954653937947494, 366.8814638027049, 117, 2067, 134.0, 959.4000000000001, 1149.7999999999984, 1549.42, 4.88138278662105, 681.4540417155322, 3.558310097899491], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=34a2bef1-74eb-440f-884d-497cc7433108", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 0.8029513888888888, 3.064236111111111], "isController": false}, {"data": ["see books", 54, 0, 0.0, 1753.2777777777783, 1435, 2288, 1694.5, 2085.5, 2161.0, 2288.0, 0.2273779948629416, 273.6127088574782, 1.118015824350499], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2c2d5185-f818-4886-a5d2-f58b15af1589", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 1.4922240070093458, 2.788222838785047], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c11dd16-7309-4fdc-9663-f8df07aa9914", 3, 0, 0.0, 471.0, 234, 680, 499.0, 680.0, 680.0, 680.0, 0.01772316417557748, 0.024432812592308145, 0.011365440568322798], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=65d84451-25d2-4a4d-8137-ae1e83e8084d", 1, 0, 0.0, 1007.0, 1007, 1007, 1007.0, 1007.0, 1007.0, 1007.0, 0.9930486593843098, 0.1794082050645482, 0.684660501489573], "isController": false}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 632.2500000000001, 127, 1130, 571.0, 1126.7, 1130.0, 1130.0, 0.07944073721004132, 0.015108480050444868, 0.05367809578897892], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 632.2500000000001, 127, 1130, 571.0, 1126.7, 1130.0, 1130.0, 0.08030247264697025, 0.015272369675778767, 0.05426037031150668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 175.99999999999997, 119, 360, 123.0, 358.4, 360.0, 360.0, 0.08852872075998502, 0.03391650209404474, 0.049917110728999965], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7154e535-1b60-4d2f-93d7-b207f1949dc8", 1, 0, 0.0, 363.0, 363, 363, 363.0, 363.0, 363.0, 363.0, 2.7548209366391188, 0.49769714187327824, 1.8993199035812673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 121.84615384615385, 119, 130, 121.0, 127.2, 130.0, 130.0, 0.08867001793862671, 0.0658963707532177, 0.04450819259809974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 204.23076923076923, 119, 596, 122.0, 552.8, 596.0, 596.0, 0.08838426760036713, 2.0210597826086953, 0.05146232408131352], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7365eeef-d7f5-47cc-af00-1c36dbb07502", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 213.30769230769232, 118, 1081, 122.0, 791.7999999999997, 1081.0, 1081.0, 0.08809378599986448, 6.1193747564715055, 0.051207160161279394], "isController": false}, {"data": ["goToProfile", 12, 1, 8.333333333333334, 213.33333333333334, 119, 340, 207.5, 308.2000000000001, 340.0, 340.0, 0.07907482455273303, 0.17044073918487035, 0.05111420340351224], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3d36aecf-6fb5-45e3-ac44-364fbbc5a32e", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 1.4129908738938053, 2.6401756084070795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 150.87499999999997, 118, 361, 121.5, 359.6, 361.0, 361.0, 0.10881170813979583, 0.080864951068735, 0.05461837693735846], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 834.6666666666666, 826, 842, 836.0, 842.0, 842.0, 842.0, 0.016598336846647965, 4.880462149567613, 0.009466238982853918], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a98d4269-3a92-40ac-ae9e-478c4621354d", 3, 0, 0.0, 354.3333333333333, 207, 490, 366.0, 490.0, 490.0, 490.0, 0.01779401646539657, 0.024530488193670076, 0.011410876444281003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 150.625, 117, 360, 121.0, 360.0, 360.0, 360.0, 0.10881244814406768, 0.049544730417159726, 0.060914781150963666], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 977.6666666666666, 832, 1053, 1048.0, 1053.0, 1053.0, 1053.0, 0.016597877684706715, 14.93479951665597, 0.009449768252132828], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 204.33333333333331, 121, 360, 132.0, 360.0, 360.0, 360.0, 0.016641242546110113, 0.029447198724171404, 0.009214438011371515], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c772b069-3f47-4116-8230-3db703f9d9be", 3, 0, 0.0, 340.0, 208, 487, 325.0, 487.0, 487.0, 487.0, 0.016865871347133365, 0.023250965219762304, 0.010815679216748935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 20, 0, 0.0, 121.05, 118, 124, 121.0, 124.0, 124.0, 124.0, 0.09568370793504989, 0.07110869310407517, 0.048028736209585594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 20, 0, 0.0, 157.24999999999997, 117, 362, 121.5, 360.40000000000003, 361.95, 362.0, 0.09568599683279351, 0.025603479621274825, 0.054570920068702546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 20, 0, 0.0, 168.35, 117, 371, 120.5, 362.3, 370.6, 371.0, 0.09568645462548322, 0.025790489723274773, 0.056253169613809474], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c5b4a7e5-adf1-49eb-8899-d4522c1088a3", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 1.174029181985294, 2.193675321691176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 20, 0, 0.0, 144.4, 117, 359, 121.0, 332.3000000000005, 358.8, 359.0, 0.09568508126055525, 0.025790119558509034, 0.056345804687612126], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a21755bb-6cc3-466e-9203-0c8464460013", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 122.33333333333333, 121, 124, 122.0, 124.0, 124.0, 124.0, 0.016663148890789722, 0.012383453423721658, 0.009356748644730557], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 624.0, 118, 1105, 699.5, 1089.7, 1105.0, 1105.0, 0.07792511396547919, 35.069078888625526, 0.04246309921165759], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 284.25, 117, 1071, 122.0, 1067.5, 1071.0, 1071.0, 0.10881244814406768, 12.264366324757551, 0.06280093442689844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 452.88888888888897, 117, 848, 354.5, 845.3, 848.0, 848.0, 0.07792410192472532, 11.46663813508143, 0.042538645484298296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 240.5625, 120, 842, 122.0, 826.6, 842.0, 842.0, 0.10881170813979583, 4.024944021476711, 0.06290676876831947], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 436.5833333333333, 123, 1007, 419.0, 881.3000000000004, 1007.0, 1007.0, 0.08026594784051157, 0.015265423185487919, 0.05486276822204237], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 20, 0, 0.0, 327.8, 237, 492, 247.5, 485.6, 491.7, 492.0, 0.09562789274375551, 0.1482045564300195, 0.2150693720594423], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e917d024-3a91-457b-8460-98ab55feaca5", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 0.7496434128630706, 2.8608013485477177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 525.6190476190477, 128, 1714, 450.0, 1135.2000000000003, 1662.7999999999993, 1714.0, 0.08875927217396817, 0.05452107636467381, 0.04013236622709694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 147.88888888888886, 117, 370, 121.0, 356.5, 370.0, 370.0, 0.07792308991025858, 0.05790964006026052, 0.03911373849011026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 175.55555555555551, 118, 362, 122.0, 362.0, 362.0, 362.0, 0.07792646339404383, 0.07937236457030049, 0.041170133492361045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c772b069-3f47-4116-8230-3db703f9d9be", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 0.36205222945891785, 1.3816695891783568], "isController": false}, {"data": ["login", 21, 0, 0.0, 2078.952380952381, 1170, 4059, 2070.0, 2961.4000000000005, 3959.9999999999986, 4059.0, 0.08854968269697033, 15.258204846250342, 0.15457898710758786], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 140.06250000000003, 121, 361, 125.0, 205.60000000000016, 361.0, 361.0, 0.10381049394330649, 0.084041894022462, 0.03690138651890973], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7aeb23a7-1798-4aa9-8423-c094caadd8ea", 3, 0, 0.0, 473.33333333333337, 195, 885, 340.0, 885.0, 885.0, 885.0, 0.03894283192273742, 0.03246503663871437, 0.02497310510670336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 774.8888888888888, 240, 1224, 949.5, 1214.1, 1224.0, 1224.0, 0.0778802720617504, 46.64629007994626, 0.1651913583184784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 401.4615384615385, 242, 1202, 248.0, 965.5999999999998, 1202.0, 1202.0, 0.08802101671045148, 8.226209357988246, 0.1962289447803537], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, 40.0, 708.2, 119, 1177, 953.0, 1177.0, 1177.0, 1177.0, 0.0276441643169127, 19.846177503179078, 0.04472739398462984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0161a1eb-054b-438e-a4d2-f05907167bea", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 3.6363636363636362, 1.1612215909090908, 2.169744318181818], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c6b4a12e-8c5f-406e-b240-46097f537fad", 1, 0, 0.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 501.0, 1.996007984031936, 0.3606069111776447, 1.3761539421157685], "isController": false}, {"data": ["register", 22, 3, 13.636363636363637, 1087.772727272727, 139, 2067, 985.0, 1965.3, 2059.35, 2067.0, 0.09115317047300209, 0.029116575582551624, 0.04112574683449899], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c8b00c55-d550-47ee-964a-4ce65039bb6f", 1, 0, 0.0, 315.0, 315, 315, 315.0, 315.0, 315.0, 315.0, 3.1746031746031744, 1.013764880952381, 1.8942212301587302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 123.99999999999999, 120, 133, 123.0, 130.0, 133.0, 133.0, 0.09099567467226391, 0.07064605601997052, 0.032346118731156316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 481.99999999999994, 241, 1428, 365.0, 1263.5000000000002, 1428.0, 1428.0, 0.10872298064051426, 16.406247345630355, 0.24104330742102292], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c6b4a12e-8c5f-406e-b240-46097f537fad", 3, 0, 0.0, 542.0, 228, 937, 461.0, 937.0, 937.0, 937.0, 0.01963839174663856, 0.023211914203139523, 0.012593630123983714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 424.9375, 242, 1219, 477.5, 709.4000000000005, 1219.0, 1219.0, 0.0947552944520775, 7.222691089226916, 0.21159162614890795], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a21755bb-6cc3-466e-9203-0c8464460013", 3, 0, 0.0, 484.33333333333337, 202, 976, 275.0, 976.0, 976.0, 976.0, 0.01856481596079111, 0.025593097524072378, 0.011905171693606277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 148.88888888888889, 118, 361, 122.0, 361.0, 361.0, 361.0, 0.04548739746382488, 0.0338045990917683, 0.022832541305083973], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 174.77777777777777, 117, 363, 126.0, 363.0, 363.0, 363.0, 0.04548670777317295, 0.027353226397452742, 0.025092710755079347], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c11dd16-7309-4fdc-9663-f8df07aa9914", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 360.3333333333333, 117, 1081, 123.0, 1081.0, 1081.0, 1081.0, 0.04548762736535662, 9.10505738706433, 0.025873062353428757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 252.88888888888889, 117, 836, 122.0, 836.0, 836.0, 836.0, 0.045488087175391954, 2.981759908821656, 0.025917745850475602], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 123.0, 123, 123, 123.0, 123.0, 123.0, 123.0, 8.130081300813009, 2.3977388211382116, 5.025724085365853], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1144.814814814815, 933, 1744, 968.0, 1577.5, 1664.5, 1744.0, 0.23065981521585915, 275.9493293245512, 0.45546303356100315], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/234a3264-8532-4885-a710-7335ebf72d39", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 1.400596217105263, 2.617016173245614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 3, 13.636363636363637, 1087.772727272727, 139, 2067, 985.0, 1965.3, 2059.35, 2067.0, 0.08765673622095872, 0.02799972806489786, 0.03954825403719036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 121.4, 117, 124, 122.0, 124.0, 124.0, 124.0, 0.024954458113942056, 0.006726006288523444, 0.014694861565143612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 121.0, 118, 125, 121.0, 125.0, 125.0, 125.0, 0.0249539599439035, 0.006725872016130239, 0.014670199107646392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 215.2, 117, 1069, 121.0, 641.2000000000003, 1069.0, 1069.0, 0.08517839194553127, 5.131005475905872, 0.04958757687349873], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 232.13333333333333, 118, 838, 123.0, 552.4000000000002, 838.0, 838.0, 0.08517839194553127, 1.6911127172758815, 0.04967075889688304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 122.2, 121, 126, 121.0, 126.0, 126.0, 126.0, 0.0249539599439035, 0.006677133813114803, 0.014231555280507464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 122.26666666666665, 119, 137, 122.0, 128.6, 137.0, 137.0, 0.08518226164583487, 0.06330439561765658, 0.04275750242769446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 124.2, 119, 134, 123.0, 134.0, 134.0, 134.0, 0.024954209026436486, 0.01854507135656071, 0.012525843202723003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 137.26666666666668, 117, 354, 120.0, 220.80000000000007, 354.0, 354.0, 0.08517694089855994, 0.03132027097624131, 0.04810057196315813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 127.4, 124, 134, 127.0, 134.0, 134.0, 134.0, 0.0258732212160414, 0.020365054980595085, 0.009197121604139715], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 535.0833333333333, 120, 976, 474.0, 948.7, 976.0, 976.0, 0.07870968588276192, 0.014790093156192813, 0.053568449140424634], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1102.904761904762, 668, 1511, 1112.0, 1444.0, 1504.3999999999999, 1511.0, 0.08927394773648031, 0.046206242480795474, 0.04106252869519749], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 247.6, 242, 257, 245.0, 257.0, 257.0, 257.0, 0.024939024086109464, 0.03865061643032785, 0.056088449678037194], "isController": false}, {"data": ["addBook", 58, 5, 8.620689655172415, 1160.4310344827584, 611, 2674, 964.5, 1759.7, 1927.1499999999987, 2674.0, 0.26999222608590406, 90.1207747889522, 0.9811402574701729], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7aeb23a7-1798-4aa9-8423-c094caadd8ea", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.43324715227817745, 1.6533648081534773], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/34a2bef1-74eb-440f-884d-497cc7433108", 3, 0, 0.0, 300.0, 201, 400, 299.0, 400.0, 400.0, 400.0, 0.10460980542576191, 0.0473332127414743, 0.06708376194295279], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 221.64814814814812, 119, 667, 123.0, 489.5, 517.5, 667.0, 0.23150827642088204, 0.17204863120731567, 0.11191073909017248], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 696.6666666666666, 582, 963, 603.5, 887.0, 956.25, 963.0, 0.23118417672745956, 67.975823994991, 0.11626938575648599], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 193.98148148148144, 117, 496, 123.5, 363.5, 398.75, 496.0, 0.2316860739507624, 0.40997574804568504, 0.11267545393308562], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 917.1481481481483, 811, 1213, 839.0, 1089.0, 1159.25, 1213.0, 0.23123070401185272, 208.061793930087, 0.11606697447469952], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 154.68749999999997, 122, 366, 124.5, 361.8, 366.0, 366.0, 0.09376465072667604, 0.07004878691983123, 0.033330403187998126], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 5, 2.9411764705882355, 189.23529411764702, 119, 1869, 129.0, 308.30000000000007, 353.79999999999995, 1222.8999999999928, 0.6999053069290626, 1.4757154408888797, 0.3378024131294002], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 127.77777777777777, 122, 140, 124.0, 140.0, 140.0, 140.0, 0.04706965262596362, 0.03645140091053628, 0.01673179058188551], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a98d4269-3a92-40ac-ae9e-478c4621354d", 1, 0, 0.0, 588.0, 588, 588, 588.0, 588.0, 588.0, 588.0, 1.7006802721088434, 0.30725180697278914, 1.1725393282312926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 149.38461538461542, 121, 359, 128.0, 276.5999999999999, 359.0, 359.0, 0.08729636444217623, 0.07084304575336763, 0.03103112954780483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 511.6666666666667, 241, 1202, 250.0, 1202.0, 1202.0, 1202.0, 0.04545821884596735, 12.140091852435045, 0.09965195261990868], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 386.93333333333334, 242, 1190, 250.0, 766.4000000000003, 1190.0, 1190.0, 0.08511845651865513, 6.911873581359059, 0.18998151333522487], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e917d024-3a91-457b-8460-98ab55feaca5", 3, 0, 0.0, 301.6666666666667, 198, 405, 302.0, 405.0, 405.0, 405.0, 0.05686449191576473, 0.025729701745739905, 0.036465836287127774], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7154e535-1b60-4d2f-93d7-b207f1949dc8", 3, 0, 0.0, 302.0, 214, 410, 282.0, 410.0, 410.0, 410.0, 0.07407773223369056, 0.034386343152748286, 0.047504274902464325], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7365eeef-d7f5-47cc-af00-1c36dbb07502", 3, 0, 0.0, 286.6666666666667, 208, 400, 252.0, 400.0, 400.0, 400.0, 0.036325769500883925, 0.02992855553604727, 0.02329484567602257], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 20, 0, 0.0, 171.89999999999998, 119, 367, 125.0, 359.9, 366.65, 367.0, 0.09696875666660203, 0.08039694766596202, 0.034469362721331186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/35955cfd-aa57-4933-8268-5c154de2c124", 1, 0, 0.0, 597.0, 597, 597, 597.0, 597.0, 597.0, 597.0, 1.6750418760469012, 0.534901067839196, 0.9994634631490787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 131.55555555555557, 120, 161, 125.0, 158.3, 161.0, 161.0, 0.07886746322804526, 0.06123011061161718, 0.028034918569344217], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/65d84451-25d2-4a4d-8137-ae1e83e8084d", 3, 0, 0.0, 402.0, 201, 707, 298.0, 707.0, 707.0, 707.0, 0.0524714030853185, 0.03373405634554168, 0.03364865367124917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 138.06250000000003, 119, 381, 121.5, 204.6000000000002, 381.0, 381.0, 0.09495774380400722, 0.0705691826512202, 0.04766433624537081], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 180.0625, 117, 361, 121.0, 361.0, 361.0, 361.0, 0.09495999810080004, 0.0343233098604088, 0.05365842666120647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 223.6875, 118, 818, 121.0, 498.8000000000003, 818.0, 818.0, 0.0949605616917224, 5.3643501822797655, 0.05531638188389884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 255.56250000000003, 118, 837, 130.5, 503.10000000000036, 837.0, 837.0, 0.09482492947395871, 1.7665657484946542, 0.055329975938174146], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 25.0, 0.2386634844868735], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 8.333333333333334, 0.07955449482895784], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 8.333333333333334, 0.07955449482895784], "isController": false}, {"data": ["401/Unauthorized", 7, 58.333333333333336, 0.5568814638027049], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1257, 12, "401/Unauthorized", 7, "406/Not Acceptable", 3, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
