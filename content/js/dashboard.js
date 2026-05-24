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

    var data = {"OkPercent": 97.339593114241, "KoPercent": 2.6604068857589986};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7518321119253831, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=44d194fb-0d2d-43fd-bc1a-a109890cf06a"], "isController": false}, {"data": [0.009259259259259259, 500, 1500, "see books"], "isController": true}, {"data": [0.5588235294117647, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5588235294117647, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=29859656-8221-489d-9493-b0768e2378f2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1a65fa45-dfa4-4370-afa5-8baa03932573"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/56703cb4-0ab6-4088-921c-4449e7edccfd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a817b8d4-f9f4-4f2f-a53b-5a913d2f1b53"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7d58216-5821-4afa-a270-9c8a32e5bb4d"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ffac2fb4-f08d-445a-ae88-6784a3f9acb7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4b854628-b121-4860-9935-681e9f15a0d9"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7d3620c6-cb14-4e8f-a1df-dbf637a80d9e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b9bd5747-a0be-4f39-80c2-1e0ab528b353"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f4f495c0-1328-43af-830f-a4d8feec94f4"], "isController": false}, {"data": [0.9047619047619048, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.17857142857142858, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5adfa476-b548-401d-833d-4a49938776ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/935e38ba-0670-48ef-8b5a-6a218c850cac"], "isController": false}, {"data": [0.3, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a817b8d4-f9f4-4f2f-a53b-5a913d2f1b53"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7d3620c6-cb14-4e8f-a1df-dbf637a80d9e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1a65fa45-dfa4-4370-afa5-8baa03932573"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=56703cb4-0ab6-4088-921c-4449e7edccfd"], "isController": false}, {"data": [0.3611111111111111, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/29859656-8221-489d-9493-b0768e2378f2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/44d194fb-0d2d-43fd-bc1a-a109890cf06a"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.23636363636363636, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.46296296296296297, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9146341463414634, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f432ba15-697a-4100-bc37-a764577e9e69"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b854628-b121-4860-9935-681e9f15a0d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/35e7e70f-008c-4429-ab76-ef544e1e7c82"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ffac2fb4-f08d-445a-ae88-6784a3f9acb7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f4f495c0-1328-43af-830f-a4d8feec94f4"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8623ff1b-324f-4791-9f40-db1afa0f5a7e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b9bd5747-a0be-4f39-80c2-1e0ab528b353"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a7d58216-5821-4afa-a270-9c8a32e5bb4d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/56434ad0-bd97-4bb6-8030-5159821983e1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=935e38ba-0670-48ef-8b5a-6a218c850cac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5adfa476-b548-401d-833d-4a49938776ea"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1278, 34, 2.6604068857589986, 408.6635367762126, 108, 3471, 136.5, 1140.0000000000014, 1368.05, 1858.920000000002, 5.022518804970643, 717.8658189753845, 3.6595130529486664], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=44d194fb-0d2d-43fd-bc1a-a109890cf06a", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.4539298052763819, 1.7322942839195978], "isController": false}, {"data": ["see books", 54, 0, 0.0, 1917.0370370370372, 1380, 2760, 1864.0, 2363.5, 2433.5, 2760.0, 0.2457852383206496, 295.7614234307864, 1.2085240966254596], "isController": true}, {"data": ["deleteBook", 17, 4, 23.529411764705884, 530.3529411764706, 118, 1369, 454.0, 947.3999999999996, 1369.0, 1369.0, 0.08879974091369709, 0.018430231153560867, 0.05935626064291012], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, 23.529411764705884, 530.3529411764706, 118, 1369, 454.0, 947.3999999999996, 1369.0, 1369.0, 0.09023019314568992, 0.018727119016278587, 0.06031241540919392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 199.04761904761904, 110, 344, 115.0, 343.8, 344.0, 344.0, 0.11677305989901911, 0.03124591641829222, 0.06659713572365933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 149.8095238095238, 111, 346, 116.0, 344.6, 345.9, 346.0, 0.11676786548341896, 0.08677768128211116, 0.058611994978981785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 146.42857142857142, 109, 355, 115.0, 339.0, 353.7, 355.0, 0.11677046263345195, 0.031473288756672595, 0.0687622939140347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 168.76190476190476, 110, 357, 115.0, 342.0, 355.5, 357.0, 0.11677111193901211, 0.03147346376481186, 0.06864864197977079], "isController": false}, {"data": ["goToProfile", 17, 4, 23.529411764705884, 227.82352941176472, 113, 532, 221.0, 350.39999999999986, 532.0, 532.0, 0.08888517081638415, 0.1338128258033651, 0.05744245011973355], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=29859656-8221-489d-9493-b0768e2378f2", 1, 0, 0.0, 212.0, 212, 212, 212.0, 212.0, 212.0, 212.0, 4.716981132075471, 0.8521889740566038, 3.252137382075472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 130.66666666666669, 110, 326, 117.0, 204.20000000000007, 326.0, 326.0, 0.087835899117542, 0.06527648362153268, 0.04408950404923495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 174.13333333333333, 108, 343, 114.0, 341.8, 343.0, 343.0, 0.0877321245796169, 0.0322598333089633, 0.049543518789296685], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 778.2857142857143, 571, 951, 870.0, 951.0, 951.0, 951.0, 0.046287724495463804, 13.610127898768745, 0.0263984678763192], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1189.2857142857142, 903, 1479, 1183.0, 1479.0, 1479.0, 1479.0, 0.04612667703418646, 41.50486507741045, 0.026261574913018264], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1a65fa45-dfa4-4370-afa5-8baa03932573", 3, 0, 0.0, 515.3333333333334, 221, 885, 440.0, 885.0, 885.0, 885.0, 0.06702712364270073, 0.030328027950310556, 0.04298288853389338], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 174.0, 112, 325, 114.0, 325.0, 325.0, 325.0, 0.046545338484350794, 0.08236343098988637, 0.025772663008424707], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/56703cb4-0ab6-4088-921c-4449e7edccfd", 3, 0, 0.0, 955.3333333333333, 296, 2143, 427.0, 2143.0, 2143.0, 2143.0, 0.01799434977417091, 0.02480666383255658, 0.011539345395545799], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 8, 0, 0.0, 115.875, 110, 120, 116.0, 120.0, 120.0, 120.0, 0.04005607850991388, 0.029768238033246547, 0.020106273783296616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 8, 0, 0.0, 141.625, 109, 341, 115.0, 341.0, 341.0, 341.0, 0.04005828480439039, 0.010718720738674772, 0.022845740552503893], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 8, 0, 0.0, 146.125, 112, 354, 115.5, 354.0, 354.0, 354.0, 0.04000920211648679, 0.010783730257959331, 0.023521034838012742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 8, 0, 0.0, 145.5, 113, 345, 116.0, 345.0, 345.0, 345.0, 0.040011003025832104, 0.010784215659306309, 0.02356116682087574], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 115.85714285714285, 110, 121, 116.0, 121.0, 121.0, 121.0, 0.046544100535257156, 0.03458990283919013, 0.026135603327903188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 905.9285714285716, 111, 1471, 1043.5, 1416.5, 1471.0, 1471.0, 0.09210526315789475, 59.20457699424342, 0.048494037828947366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 237.99999999999997, 114, 1292, 117.0, 721.4000000000003, 1292.0, 1292.0, 0.08784104284886071, 5.2913991632408655, 0.05113766960641357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 678.7142857142857, 108, 1019, 900.0, 1007.5, 1019.0, 1019.0, 0.09210526315789475, 19.351382606907894, 0.048583984375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 220.26666666666665, 109, 563, 116.0, 501.20000000000005, 563.0, 563.0, 0.08784155725512702, 1.7439866048945316, 0.051223751844672705], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 411.93749999999994, 117, 1149, 420.0, 757.7000000000004, 1149.0, 1149.0, 0.08637116930368643, 0.017454525241974227, 0.05839437514507657], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 8, 0, 0.0, 292.125, 230, 465, 236.0, 465.0, 465.0, 465.0, 0.039985005622891416, 0.06196894914407098, 0.08992721479445208], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a817b8d4-f9f4-4f2f-a53b-5a913d2f1b53", 3, 0, 0.0, 303.6666666666667, 194, 467, 250.0, 467.0, 467.0, 467.0, 0.03333814884372187, 0.027792642965094958, 0.021378956126996123], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7d58216-5821-4afa-a270-9c8a32e5bb4d", 1, 0, 0.0, 519.0, 519, 519, 519.0, 519.0, 519.0, 519.0, 1.9267822736030829, 0.3481003131021195, 1.3284260597302504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 581.6666666666665, 209, 1589, 447.0, 1363.0, 1568.5, 1589.0, 0.1032600043885502, 0.06342826441445124, 0.04668884964052611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 131.35714285714286, 110, 338, 116.0, 228.5, 338.0, 338.0, 0.09210768704439591, 0.06845112289139188, 0.046233741348456536], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ffac2fb4-f08d-445a-ae88-6784a3f9acb7", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 242.14285714285714, 110, 357, 325.5, 353.0, 357.0, 357.0, 0.09210344532673698, 0.12345562258639634, 0.04700256738353849], "isController": false}, {"data": ["login", 24, 0, 0.0, 2966.4583333333335, 1748, 5101, 2875.5, 4315.0, 4931.25, 5101.0, 0.09919773829156696, 34.74825005760702, 0.19764471245055612], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 121.06666666666668, 114, 129, 121.0, 126.6, 129.0, 129.0, 0.08904349477908309, 0.07208696989439442, 0.031652179784752196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b854628-b121-4860-9935-681e9f15a0d9", 3, 0, 0.0, 336.6666666666667, 208, 491, 311.0, 491.0, 491.0, 491.0, 0.028201319821767656, 0.028283940875932993, 0.01808483074507887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 1039.0714285714284, 233, 1588, 1161.5, 1534.5, 1588.0, 1588.0, 0.09203502590128586, 78.68781575409555, 0.19016891303347444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7d3620c6-cb14-4e8f-a1df-dbf637a80d9e", 3, 0, 0.0, 368.0, 296, 418, 390.0, 418.0, 418.0, 418.0, 0.07717637373945256, 0.03492029931570282, 0.04949135946182342], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b9bd5747-a0be-4f39-80c2-1e0ab528b353", 3, 0, 0.0, 828.3333333333334, 532, 1229, 724.0, 1229.0, 1229.0, 1229.0, 0.02128595552654359, 0.02134831672437526, 0.01365017330315458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f4f495c0-1328-43af-830f-a4d8feec94f4", 1, 0, 0.0, 564.0, 564, 564, 564.0, 564.0, 564.0, 564.0, 1.7730496453900708, 0.32032635195035464, 1.2224346187943265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 383.4761904761904, 227, 690, 443.0, 682.0, 689.4, 690.0, 0.11669259835519005, 0.1808507359274283, 0.2624443886835963], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 7, 50.0, 710.2857142857143, 113, 1595, 568.0, 1593.0, 1595.0, 1595.0, 0.09218167691639122, 55.152999464194004, 0.1343565945290175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5adfa476-b548-401d-833d-4a49938776ea", 3, 0, 0.0, 357.0, 214, 565, 292.0, 565.0, 565.0, 565.0, 0.06924248719013987, 0.03133042226376771, 0.04440354810044777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/935e38ba-0670-48ef-8b5a-6a218c850cac", 3, 0, 0.0, 335.3333333333333, 226, 461, 319.0, 461.0, 461.0, 461.0, 0.03138863312965598, 0.025860882308320083, 0.020128778406712983], "isController": false}, {"data": ["register", 25, 7, 28.0, 1040.48, 289, 2217, 980.0, 1562.4, 2036.0999999999995, 2217.0, 0.10351409654966813, 0.03254224410280192, 0.0467026490292448], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a817b8d4-f9f4-4f2f-a53b-5a913d2f1b53", 1, 0, 0.0, 508.0, 508, 508, 508.0, 508.0, 508.0, 508.0, 1.968503937007874, 0.35563791830708663, 1.357191190944882], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 146.35294117647064, 114, 348, 120.0, 337.59999999999997, 348.0, 348.0, 0.08359847162323644, 0.06490311029343063, 0.029716644209822327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 446.4, 229, 1408, 444.0, 965.8000000000002, 1408.0, 1408.0, 0.08766854277348202, 7.118948222228068, 0.1956732195249534], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7d3620c6-cb14-4e8f-a1df-dbf637a80d9e", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 0.681751179245283, 2.6017099056603774], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1a65fa45-dfa4-4370-afa5-8baa03932573", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 0.7889260371179039, 3.0107123362445414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 402.55, 229, 1312, 346.5, 673.7000000000004, 1280.9999999999995, 1312.0, 0.12264220363511491, 7.5167035327853275, 0.27425623252348597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 118.0, 115, 126, 116.0, 126.0, 126.0, 126.0, 0.055792847356968836, 0.041463239100247344, 0.028005394083478498], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 176.77777777777777, 114, 414, 120.0, 414.0, 414.0, 414.0, 0.055793539108171274, 0.014929130581678642, 0.03181975277262893], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 140.66666666666666, 114, 342, 115.0, 342.0, 342.0, 342.0, 0.055715134706814586, 0.015016969901446117, 0.03275440536474841], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 146.77777777777777, 110, 401, 114.0, 401.0, 401.0, 401.0, 0.05579423087652737, 0.015038288790939018, 0.03285539181498633], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 158.0, 117, 239, 118.0, 239.0, 239.0, 239.0, 0.26001040041601664, 0.0766827548101924, 0.16072908541341654], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=56703cb4-0ab6-4088-921c-4449e7edccfd", 1, 0, 0.0, 1149.0, 1149, 1149, 1149.0, 1149.0, 1149.0, 1149.0, 0.8703220191470844, 0.15723591166231504, 0.6000462358572671], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1325.5555555555557, 875, 2289, 1282.5, 1867.5, 1942.5, 2289.0, 0.25547617921180865, 305.63832822775225, 0.5044656585608175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, 28.0, 1040.48, 289, 2217, 980.0, 1562.4, 2036.0999999999995, 2217.0, 0.10127730942648684, 0.031839054150951805, 0.045693473588903244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 159.6, 109, 343, 115.0, 343.0, 343.0, 343.0, 0.042268999915462006, 0.011392816383464366, 0.024890827098655845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 113.2, 110, 116, 113.0, 116.0, 116.0, 116.0, 0.042352064239611034, 0.011415204814582662, 0.02489838151586508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 334.11764705882354, 109, 1295, 115.0, 1256.6, 1295.0, 1295.0, 0.08244023083264633, 13.108863347740167, 0.04721559635808156], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/29859656-8221-489d-9493-b0768e2378f2", 3, 0, 0.0, 415.3333333333333, 247, 580, 419.0, 580.0, 580.0, 580.0, 0.0931561296733325, 0.042150722736306045, 0.05973879409390138], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 275.1176470588235, 114, 1006, 116.0, 925.1999999999999, 1006.0, 1006.0, 0.08244143021332932, 4.296037704224396, 0.04729679248279642], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 141.41176470588235, 109, 345, 115.0, 341.0, 345.0, 345.0, 0.08243903148686067, 0.061265725548340796, 0.04138052947680311], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 160.8, 110, 344, 116.0, 344.0, 344.0, 344.0, 0.04226864258481203, 0.011310164129139157, 0.02410633522415061], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 166.2941176470588, 108, 343, 115.0, 340.6, 343.0, 343.0, 0.0824438290793934, 0.04391194756572471, 0.04579686507339926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 114.6, 110, 117, 115.0, 117.0, 117.0, 117.0, 0.04235027061822925, 0.03147319916061764, 0.021257850681415853], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 482.7333333333332, 114, 1064, 461.0, 940.4000000000001, 1064.0, 1064.0, 0.09049064025144334, 0.017921388518547566, 0.06157605285859932], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 123.2, 117, 134, 118.0, 134.0, 134.0, 134.0, 0.04000064001024016, 0.03148487875806013, 0.014218977503640057], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44d194fb-0d2d-43fd-bc1a-a109890cf06a", 2, 0, 0.0, 237.5, 236, 239, 237.5, 239.0, 239.0, 239.0, 0.03548238299684207, 0.031358942004044994, 0.022055211696767555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1537.2500000000005, 874, 3471, 1388.5, 2121.5, 3157.75, 3471.0, 0.10315481818963294, 0.053390677383306114, 0.04744718688214562], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 276.4, 229, 454, 233.0, 454.0, 454.0, 454.0, 0.042227233187227105, 0.06544396393372014, 0.09497003713885159], "isController": false}, {"data": ["addBook", 55, 13, 23.636363636363637, 1149.4909090909089, 579, 2256, 932.0, 1998.8, 2099.6, 2256.0, 0.2716089621080806, 89.7077333244443, 0.9850502800658775], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 199.51851851851856, 109, 467, 117.0, 460.5, 463.25, 467.0, 0.25735364203061556, 0.191255978110643, 0.12440434844253388], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 735.8148148148149, 546, 1153, 681.0, 952.0, 1025.25, 1153.0, 0.2568761951878526, 75.53013047764702, 0.12919066457201572], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 172.33333333333331, 108, 350, 119.0, 343.5, 348.25, 350.0, 0.25783163594173003, 0.4562411370375145, 0.12539077607322419], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1124.5925925925926, 755, 1825, 1090.0, 1465.0, 1552.5, 1825.0, 0.25608558949480004, 230.42626357787137, 0.12854296191438205], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 150.79999999999998, 113, 349, 118.5, 328.6, 348.0, 349.0, 0.12574741117517244, 0.09394215776270205, 0.044699275066174576], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 164, 13, 7.926829268292683, 172.560975609756, 111, 1160, 122.0, 297.5, 348.25, 794.6999999999969, 0.7087723544207515, 1.5822578059497983, 0.33842428074732267], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 130.44444444444446, 116, 222, 119.0, 222.0, 222.0, 222.0, 0.05357110969577562, 0.04148622069213874, 0.01904285539967024], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f432ba15-697a-4100-bc37-a764577e9e69", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.6694673742138365, 1.2509008123689729], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 131.23809523809527, 113, 329, 119.0, 142.8, 310.6999999999997, 329.0, 0.12244969358421914, 0.09937079625828722, 0.0435270395162654], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b854628-b121-4860-9935-681e9f15a0d9", 1, 0, 0.0, 515.0, 515, 515, 515.0, 515.0, 515.0, 515.0, 1.941747572815534, 0.3508040048543689, 1.338743932038835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/35e7e70f-008c-4429-ab76-ef544e1e7c82", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 0.8188100961538461, 1.5299479166666665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ffac2fb4-f08d-445a-ae88-6784a3f9acb7", 3, 0, 0.0, 1148.6666666666667, 236, 2352, 858.0, 2352.0, 2352.0, 2352.0, 0.026270162349603318, 0.026347125715861924, 0.01684642572549432], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f4f495c0-1328-43af-830f-a4d8feec94f4", 3, 0, 0.0, 298.6666666666667, 201, 402, 293.0, 402.0, 402.0, 402.0, 0.033243944061523464, 0.02771410831431041, 0.021318544857161854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 320.5555555555555, 232, 540, 243.0, 540.0, 540.0, 540.0, 0.05567446521583134, 0.08628454716555112, 0.1252131771406832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 492.764705882353, 225, 1593, 235.0, 1448.1999999999998, 1593.0, 1593.0, 0.08239228420491446, 17.49983150474967, 0.18158203030339745], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8623ff1b-324f-4791-9f40-db1afa0f5a7e", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.7443728146853147, 1.3908617424242424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b9bd5747-a0be-4f39-80c2-1e0ab528b353", 1, 0, 0.0, 590.0, 590, 590, 590.0, 590.0, 590.0, 590.0, 1.694915254237288, 0.3062102754237288, 1.168564618644068], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 8, 0, 0.0, 121.125, 116, 137, 117.5, 137.0, 137.0, 137.0, 0.04083466045979828, 0.03385608079137572, 0.014515445710318918], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 121.35714285714286, 114, 140, 118.5, 135.5, 140.0, 140.0, 0.09271461778398818, 0.07198058704909238, 0.03295714929040205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7d58216-5821-4afa-a270-9c8a32e5bb4d", 3, 0, 0.0, 618.0, 305, 1064, 485.0, 1064.0, 1064.0, 1064.0, 0.02650083035935126, 0.026578469510794674, 0.016994347593724604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/56434ad0-bd97-4bb6-8030-5159821983e1", 1, 0, 0.0, 299.0, 299, 299, 299.0, 299.0, 299.0, 299.0, 3.3444816053511706, 1.068013168896321, 1.9955842391304348], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=935e38ba-0670-48ef-8b5a-6a218c850cac", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 129.75, 112, 344, 116.0, 162.4000000000001, 335.14999999999986, 344.0, 0.12272799793816964, 0.09120703753022177, 0.06160370209005781], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 181.7, 109, 345, 115.0, 343.9, 344.95, 345.0, 0.12272799793816964, 0.04205591257471067, 0.06947794961402046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 201.99999999999997, 109, 1197, 115.0, 343.5, 1154.3499999999995, 1197.0, 0.12273101044440898, 5.553104797325077, 0.07162505062654181], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5adfa476-b548-401d-833d-4a49938776ea", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 0.705718994140625, 2.69317626953125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 211.09999999999997, 109, 679, 116.0, 347.7, 662.4499999999998, 679.0, 0.12273176359407696, 1.835786722110741, 0.0717453453978657], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 20.58823529411765, 0.5477308294209703], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 11.764705882352942, 0.3129890453834116], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.823529411764707, 0.2347417840375587], "isController": false}, {"data": ["401/Unauthorized", 20, 58.8235294117647, 1.5649452269170578], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1278, 34, "401/Unauthorized", 20, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 164, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
