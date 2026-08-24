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

    var data = {"OkPercent": 96.5909090909091, "KoPercent": 3.409090909090909};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7441176470588236, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.02727272727272727, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/75bffea6-3142-49a1-8e9d-53fe31da82f0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c8dbc3b2-6f9a-4c7a-8a9e-a2e3afea3080"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4583333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5684bfab-1391-4303-917c-8385a430d228"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.1885245901639344, 500, 1500, "addBook"], "isController": true}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8dbc3b2-6f9a-4c7a-8a9e-a2e3afea3080"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f22594e3-1a0d-4e14-bc6d-8aa63d98d19e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.4727272727272727, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8418079096045198, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e9ec968f-3ab2-401a-b07b-c316f92532e0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c55f546a-07f6-48a9-bfc8-9729fb13a002"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b24ed81d-2867-47a0-b3f7-081a1d94af76"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4c74189b-4b27-4f69-9270-d6a012ba835a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f22594e3-1a0d-4e14-bc6d-8aa63d98d19e"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e9ec968f-3ab2-401a-b07b-c316f92532e0"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c55f546a-07f6-48a9-bfc8-9729fb13a002"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab6ad568-c491-4839-aefd-c47522580777"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1b6d11e0-18d9-4ae7-b393-ff6fbf6f0198"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ab6ad568-c491-4839-aefd-c47522580777"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=15b1148f-7c20-43b6-a112-7423889d50c6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/715bfd65-3097-496f-9e5e-5790c913cc18"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/15b1148f-7c20-43b6-a112-7423889d50c6"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=75bffea6-3142-49a1-8e9d-53fe31da82f0"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.26666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1b6d11e0-18d9-4ae7-b393-ff6fbf6f0198"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b24ed81d-2867-47a0-b3f7-081a1d94af76"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4c74189b-4b27-4f69-9270-d6a012ba835a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1320, 45, 3.409090909090909, 413.2242424242423, 106, 8872, 128.0, 1117.7000000000003, 1369.8000000000002, 2058.499999999998, 5.201785946508301, 710.5339351880131, 3.8250529106849416], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1902.5636363636368, 1373, 2573, 1912.0, 2283.2, 2504.6, 2573.0, 0.24086466033703535, 289.8414354411546, 1.184329653122044], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 131.4, 115, 332, 118.0, 135.0, 322.14999999999986, 332.0, 0.09353968187154195, 0.07262113973425377, 0.03325043379027468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 356.18749999999994, 227, 676, 233.0, 673.9, 676.0, 676.0, 0.08769766230918907, 0.1359142481295733, 0.1972340979473266], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/75bffea6-3142-49a1-8e9d-53fe31da82f0", 3, 0, 0.0, 557.6666666666666, 242, 939, 492.0, 939.0, 939.0, 939.0, 0.03369839932603201, 0.02809296896939062, 0.021609976130300475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 400.0, 225, 680, 452.0, 675.8, 680.0, 680.0, 0.07793867784826898, 0.12078972826679968, 0.17528591316851902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 114.39999999999999, 113, 116, 114.5, 116.0, 116.0, 116.0, 0.04985740781365295, 0.03705223373651357, 0.02502608165646252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 116.2, 113, 130, 114.5, 128.8, 130.0, 130.0, 0.04985740781365295, 0.013340751700137606, 0.02843430289372395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 156.9, 111, 334, 113.5, 333.4, 334.0, 334.0, 0.04985740781365295, 0.013438129449773647, 0.029310702640448317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 158.6, 111, 334, 113.5, 333.3, 334.0, 334.0, 0.04980426922195771, 0.013423806938730787, 0.029328099942227046], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 118.33333333333333, 118, 119, 118.0, 119.0, 119.0, 119.0, 0.05755064456721915, 0.016972944003222835, 0.03557574024516574], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1282.018181818182, 884, 2079, 1138.0, 1810.6, 2024.9999999999998, 2079.0, 0.24309929501204444, 290.8312718236867, 0.48002614698667373], "isController": false}, {"data": ["deleteBook", 13, 3, 23.076923076923077, 656.0000000000001, 117, 2804, 477.0, 2085.999999999999, 2804.0, 2804.0, 0.07847066706103208, 0.016245880289979295, 0.05246900597282501], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 3, 23.076923076923077, 656.0000000000001, 117, 2804, 477.0, 2085.999999999999, 2804.0, 2804.0, 0.0776931122067832, 0.016084902136560587, 0.05194909793814433], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 9, 42.857142857142854, 1119.095238095238, 154, 2147, 1161.0, 2012.6, 2133.7999999999997, 2147.0, 0.09425324500457802, 0.029138559002531372, 0.042524413273549846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 150.28571428571428, 109, 341, 122.0, 341.0, 341.0, 341.0, 0.04069128683288089, 0.010967573404174927, 0.02396176363303435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 173.2941176470588, 110, 461, 114.0, 365.7999999999999, 461.0, 461.0, 0.11941388853767157, 0.03195254439386915, 0.06810323330664082], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 184.14285714285714, 112, 341, 132.0, 341.0, 341.0, 341.0, 0.040636483434827786, 0.010952802175793428, 0.023889807644303058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 152.70588235294122, 110, 340, 114.0, 335.2, 340.0, 340.0, 0.11941808270755916, 0.08874722748091067, 0.059942279796567785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 226.29411764705884, 109, 462, 122.0, 365.9999999999999, 462.0, 462.0, 0.11941808270755916, 0.032186905104771804, 0.07032139050064275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8dbc3b2-6f9a-4c7a-8a9e-a2e3afea3080", 3, 0, 0.0, 927.0, 492, 1679, 610.0, 1679.0, 1679.0, 1679.0, 0.018865551502955605, 0.022298443198968683, 0.012098026191674003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 186.4705882352941, 107, 452, 115.0, 365.5999999999999, 452.0, 452.0, 0.11942227717208048, 0.03218803564403731, 0.07020723716561762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 182.14999999999998, 106, 345, 115.0, 344.7, 345.0, 345.0, 0.0931883943173717, 0.025117184405854094, 0.054784583377986106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 169.2, 107, 344, 116.0, 341.3, 343.9, 344.0, 0.09318969694710552, 0.025117535505274534, 0.05487635474521937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 148.65, 108, 335, 116.0, 333.6, 335.0, 335.0, 0.09328010148875042, 0.06932241917279207, 0.04682223844259543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 178.85714285714286, 112, 342, 115.0, 342.0, 342.0, 342.0, 0.04063955041045946, 0.010874254699673722, 0.02317724359346516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 156.35, 107, 342, 112.5, 336.7, 341.75, 342.0, 0.093289238619879, 0.024962159552584812, 0.05320401890039975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 144.85714285714286, 109, 332, 114.0, 332.0, 332.0, 332.0, 0.040689158083191894, 0.030238720020809597, 0.02042405005347718], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 120.71428571428571, 113, 131, 119.0, 131.0, 131.0, 131.0, 0.03959723950673153, 0.031167358439868762, 0.014075581230908473], "isController": false}, {"data": ["deleteAccount", 12, 2, 16.666666666666668, 767.9166666666667, 113, 1680, 501.0, 1679.7, 1680.0, 1680.0, 0.07362956963516548, 0.01436879133993545, 0.05010501800856557], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5684bfab-1391-4303-917c-8385a430d228", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 1.2096058238636362, 2.260150331439394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 2183.142857142857, 775, 8872, 1469.0, 7105.800000000004, 8811.699999999999, 8872.0, 0.09399968666771111, 0.04865218157606141, 0.043236184004386655], "isController": false}, {"data": ["goToProfile", 14, 4, 28.571428571428573, 510.8571428571428, 113, 2560, 229.0, 2289.5, 2560.0, 2560.0, 0.08195473756922249, 0.1411055236761383, 0.052959590460468546], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 363.2857142857143, 228, 675, 251.0, 675.0, 675.0, 675.0, 0.040608430310132386, 0.06293513564666026, 0.09132931152757313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 156.5, 112, 340, 116.0, 335.8, 340.0, 340.0, 0.08775345666350388, 0.06521521535246724, 0.044048121801797846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 140.8125, 111, 337, 114.0, 330.7, 337.0, 337.0, 0.08775393795796586, 0.023481034180158834, 0.0500471677416524], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 784.5555555555555, 579, 1100, 680.0, 1100.0, 1100.0, 1100.0, 0.07500125002083367, 22.0528577820047, 0.042774150402506705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 1204.6666666666667, 777, 1339, 1256.0, 1339.0, 1339.0, 1339.0, 0.07473531243512559, 67.24696549979241, 0.04254949916960764], "isController": false}, {"data": ["addBook", 61, 24, 39.34426229508197, 1130.049180327869, 571, 4934, 861.0, 2016.2000000000003, 2192.9, 4934.0, 0.2856875234170101, 62.75278022111512, 1.0420569501686023], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 233.55555555555554, 111, 516, 115.0, 516.0, 516.0, 516.0, 0.07549702206190756, 0.13359433982048485, 0.04180352686435702], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 116.8, 112, 128, 116.0, 124.4, 128.0, 128.0, 0.06723743780537003, 0.049968447431529874, 0.03375004202339863], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8dbc3b2-6f9a-4c7a-8a9e-a2e3afea3080", 1, 0, 0.0, 2553.0, 2553, 2553, 2553.0, 2553.0, 2553.0, 2553.0, 0.3916960438699569, 0.07076539855072464, 0.2700560614962789], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 159.79999999999998, 113, 345, 115.0, 342.0, 345.0, 345.0, 0.06723713641518483, 0.02472365536933359, 0.037969721436543834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 249.20000000000002, 111, 1017, 115.0, 614.4000000000003, 1017.0, 1017.0, 0.06723683502770157, 4.050235756156653, 0.039142693933444495], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 203.76363636363632, 111, 478, 117.0, 458.4, 466.79999999999995, 478.0, 0.244182897429864, 0.18146795404699853, 0.11803763108181903], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 195.0, 110, 889, 114.0, 558.4000000000002, 889.0, 889.0, 0.06723713641518483, 1.33491104807007, 0.039208530655651726], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 725.8727272727275, 534, 1077, 672.0, 919.6, 1002.2, 1077.0, 0.24400523502140592, 71.74564083261241, 0.12271747659767973], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 138.33333333333334, 113, 331, 114.0, 331.0, 331.0, 331.0, 0.07549765537836908, 0.05610714428021374, 0.04239370297125217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f22594e3-1a0d-4e14-bc6d-8aa63d98d19e", 1, 0, 0.0, 2647.0, 2647, 2647, 2647.0, 2647.0, 2647.0, 2647.0, 0.3777861730260672, 0.06825238477521724, 0.26046585757461277], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 157.34545454545452, 109, 357, 117.0, 340.8, 349.4, 357.0, 0.24460425255611443, 0.43283486878093685, 0.11895792751264159], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 801.3124999999998, 110, 1366, 985.5, 1347.8, 1366.0, 1366.0, 0.07695119370539236, 43.283289882962045, 0.04110576460629845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 154.9375, 109, 341, 113.0, 339.6, 341.0, 341.0, 0.08775586318860928, 0.023652947500054845, 0.051590849257366005], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1075.2727272727275, 765, 1622, 1020.0, 1373.2, 1562.1999999999998, 1622.0, 0.24364420857716212, 219.23148715856587, 0.12229797188345833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 594.25, 112, 1038, 783.5, 943.5000000000001, 1038.0, 1038.0, 0.07695045352673546, 14.149020414714851, 0.04118051614516703], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 135.86666666666665, 114, 346, 118.0, 223.60000000000008, 346.0, 346.0, 0.08109905438502586, 0.06058669590287577, 0.028828179488427166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 183.4375, 110, 346, 115.0, 340.4, 346.0, 346.0, 0.08775634450946945, 0.02365307723106794, 0.05167683177657235], "isController": false}, {"data": ["deleteBooks", 13, 3, 23.076923076923077, 858.6923076923076, 118, 2647, 482.0, 2609.4, 2647.0, 2647.0, 0.07788161993769471, 0.016123929127725856, 0.05241447062964295], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 24, 13.559322033898304, 202.6553672316384, 111, 4455, 119.0, 280.2000000000003, 382.3999999999999, 2604.8399999999974, 0.7328889072916236, 1.52895050282597, 0.35205338935240776], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 176.0, 112, 482, 115.5, 469.40000000000003, 482.0, 482.0, 0.05028992139685286, 0.038945222331742496, 0.01787649549653754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 368.33333333333337, 227, 1134, 237.0, 733.2000000000003, 1134.0, 1134.0, 0.06720279563629847, 5.457068264039783, 0.14999436476557423], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e9ec968f-3ab2-401a-b07b-c316f92532e0", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 122.23529411764707, 113, 151, 119.0, 132.6, 151.0, 151.0, 0.12658887656095255, 0.10272984025600738, 0.0449983897150261], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c55f546a-07f6-48a9-bfc8-9729fb13a002", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.3988169150110375, 1.5219715783664458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b24ed81d-2867-47a0-b3f7-081a1d94af76", 3, 0, 0.0, 325.3333333333333, 221, 506, 249.0, 506.0, 506.0, 506.0, 0.07496439191384092, 0.033919435143306934, 0.04807286851245658], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 684.2857142857143, 157, 1785, 702.0, 1581.8000000000004, 1774.2999999999997, 1785.0, 0.09344130995817389, 0.05739705465204236, 0.04224934229554151], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c74189b-4b27-4f69-9270-d6a012ba835a", 3, 0, 0.0, 435.0, 215, 668, 422.0, 668.0, 668.0, 668.0, 0.03220127946417071, 0.026844881740801168, 0.020649909031385513], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 114.12500000000001, 109, 119, 114.0, 117.6, 119.0, 119.0, 0.0769489732121387, 0.05718571153753667, 0.03862477756937431], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 185.25, 107, 353, 115.0, 350.2, 353.0, 353.0, 0.07694712289898285, 0.09282122418063336, 0.03984493351287662], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f22594e3-1a0d-4e14-bc6d-8aa63d98d19e", 3, 0, 0.0, 658.3333333333333, 217, 1534, 224.0, 1534.0, 1534.0, 1534.0, 0.022222386832495056, 0.0262661089156216, 0.014250684264327884], "isController": false}, {"data": ["login", 21, 0, 0.0, 3705.333333333333, 1328, 10768, 3097.0, 9530.800000000003, 10759.2, 10768.0, 0.0940822278671559, 48.36153332610916, 0.20881056963428893], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 297.0, 228, 449, 233.5, 448.9, 449.0, 449.0, 0.04977600796416127, 0.07714309046789447, 0.11194740853658536], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 119.93749999999999, 115, 130, 118.0, 127.9, 130.0, 130.0, 0.0895972045672175, 0.0725352369006087, 0.0318490063110031], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e9ec968f-3ab2-401a-b07b-c316f92532e0", 3, 0, 0.0, 406.6666666666667, 242, 528, 450.0, 528.0, 528.0, 528.0, 0.0472411186696901, 0.030371487425988917, 0.030294597584404132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 355.25, 226, 678, 240.0, 676.4000000000001, 678.0, 678.0, 0.09312981364724289, 0.1443330217364985, 0.20945113362265663], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c55f546a-07f6-48a9-bfc8-9729fb13a002", 3, 0, 0.0, 944.3333333333333, 214, 1680, 939.0, 1680.0, 1680.0, 1680.0, 0.032094142818935543, 0.0321881686279754, 0.020581204867611662], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab6ad568-c491-4839-aefd-c47522580777", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 125.79999999999998, 116, 175, 121.0, 152.8, 175.0, 175.0, 0.06917670497518862, 0.05735451418353041, 0.02459015684664908], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b6d11e0-18d9-4ae7-b393-ff6fbf6f0198", 3, 0, 0.0, 1133.3333333333333, 321, 2019, 1060.0, 2019.0, 2019.0, 2019.0, 0.022876315388134817, 0.022943335843373495, 0.014670032980021354], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab6ad568-c491-4839-aefd-c47522580777", 3, 0, 0.0, 326.6666666666667, 241, 496, 243.0, 496.0, 496.0, 496.0, 0.03075125311356438, 0.02563605443484322, 0.019720041872956322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 920.9999999999998, 228, 1478, 1125.5, 1458.4, 1478.0, 1478.0, 0.07690422059975678, 57.54730998949777, 0.1606614784355759], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=15b1148f-7c20-43b6-a112-7423889d50c6", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 122.31250000000001, 113, 141, 120.5, 136.1, 141.0, 141.0, 0.0732272148944155, 0.05685120687603548, 0.026029986544499263], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/715bfd65-3097-496f-9e5e-5790c913cc18", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.7392035590277778, 1.3812029803240742], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/15b1148f-7c20-43b6-a112-7423889d50c6", 3, 0, 0.0, 1113.3333333333333, 358, 2560, 422.0, 2560.0, 2560.0, 2560.0, 0.018287553491093962, 0.025210868826426733, 0.011727369914536167], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=75bffea6-3142-49a1-8e9d-53fe31da82f0", 1, 0, 0.0, 1752.0, 1752, 1752, 1752.0, 1752.0, 1752.0, 1752.0, 0.5707762557077625, 0.1031187571347032, 0.393523473173516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 441.35294117647055, 224, 797, 455.0, 793.0, 797.0, 797.0, 0.11931750387781888, 0.18491882681064312, 0.26834786272521177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 6, 40.0, 852.2666666666668, 113, 1605, 1212.0, 1513.8, 1605.0, 1605.0, 0.11252391133115787, 80.78267413075278, 0.1818037700198792], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1b6d11e0-18d9-4ae7-b393-ff6fbf6f0198", 1, 0, 0.0, 971.0, 971, 971, 971.0, 971.0, 971.0, 971.0, 1.0298661174047374, 0.1860597966014418, 0.710044412976313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 149.33333333333334, 109, 341, 116.0, 336.8, 341.0, 341.0, 0.07798568182881624, 0.0579561561247355, 0.03914515669923002], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b24ed81d-2867-47a0-b3f7-081a1d94af76", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 0.7720686431623931, 2.946380876068376], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4c74189b-4b27-4f69-9270-d6a012ba835a", 1, 0, 0.0, 770.0, 770, 770, 770.0, 770.0, 770.0, 770.0, 1.2987012987012987, 0.2346286525974026, 0.8953936688311688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 172.2, 108, 340, 114.0, 338.8, 340.0, 340.0, 0.07798933105951106, 0.02086823897490823, 0.0444782903698774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 172.6, 112, 347, 114.0, 341.0, 347.0, 347.0, 0.07798649273945753, 0.02101979687118191, 0.04584752795815764], "isController": false}, {"data": ["register", 21, 9, 42.857142857142854, 1119.095238095238, 154, 2147, 1161.0, 2012.6, 2133.7999999999997, 2147.0, 0.09652820232311207, 0.029841866119979958, 0.043550810032497826], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 204.6, 112, 346, 115.0, 344.8, 346.0, 346.0, 0.0779860872820289, 0.021019687587734346, 0.045923447881897866], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 20.0, 0.6818181818181818], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 8.88888888888889, 0.30303030303030304], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 4.444444444444445, 0.15151515151515152], "isController": false}, {"data": ["401/Unauthorized", 30, 66.66666666666667, 2.272727272727273], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1320, 45, "401/Unauthorized", 30, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 24, "401/Unauthorized", 24, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 6, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
