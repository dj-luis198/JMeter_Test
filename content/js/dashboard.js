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

    var data = {"OkPercent": 98.12938425565082, "KoPercent": 1.8706157443491815};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7284366576819407, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/74bf9835-de7f-43ea-a4a7-475cf236a614"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7b282d0f-948a-4404-910e-229cbb226140"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/215399a6-35d4-458f-a8f5-ccd343084d9c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/05ab782f-3ef1-45e4-8560-a1e09d2749fc"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.45454545454545453, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9e028634-ccd4-4ffc-af5c-e2b783348de2"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7cd02b51-82a6-436c-9664-23d161a813d4"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=75d0afdf-3165-43c4-a6f6-3de91333cc39"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/00ecd639-0ce3-4646-8c97-27ec7b762356"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5bd32d58-4a87-4aeb-99f6-274e00ddee25"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b33d2222-f826-4e3e-a96e-1d03830209ce"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/248de8ff-3e19-44ca-a99e-a4b68a39bf18"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b3229019-453d-496f-9d5f-856e280143a3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3a5729c2-9209-4f8d-98b9-5ea3b68999c8"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/cbccf1b0-b9b4-46f8-a88a-b5cd99f33dc6"], "isController": false}, {"data": [0.225, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b3229019-453d-496f-9d5f-856e280143a3"], "isController": false}, {"data": [0.868421052631579, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/798d9272-d409-4a59-a90e-a88793faf386"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=05ab782f-3ef1-45e4-8560-a1e09d2749fc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2545454545454545, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.225, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3157894736842105, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0526e1f0-e2b4-4547-b72c-cd11bfbc989f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9e028634-ccd4-4ffc-af5c-e2b783348de2"], "isController": false}, {"data": [0.26229508196721313, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=215399a6-35d4-458f-a8f5-ccd343084d9c"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.2909090909090909, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.923728813559322, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7cd02b51-82a6-436c-9664-23d161a813d4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/75d0afdf-3165-43c4-a6f6-3de91333cc39"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=248de8ff-3e19-44ca-a99e-a4b68a39bf18"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cbccf1b0-b9b4-46f8-a88a-b5cd99f33dc6"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/3a5729c2-9209-4f8d-98b9-5ea3b68999c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1283, 24, 1.8706157443491815, 475.60717069368667, 136, 2569, 156.0, 1351.8000000000025, 1696.0, 2185.240000000001, 5.09529350558576, 706.484443103135, 3.723759970671284], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2425.6, 1736, 3166, 2386.0, 2966.8, 3072.2, 3166.0, 0.25466499976848633, 306.4485003342478, 1.2521858142913367], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/74bf9835-de7f-43ea-a4a7-475cf236a614", 1, 0, 0.0, 634.0, 634, 634, 634.0, 634.0, 634.0, 634.0, 1.5772870662460567, 0.5036844440063092, 0.941135153785489], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7b282d0f-948a-4404-910e-229cbb226140", 2, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 0.07410151908114117, 0.04555361939607262, 0.04606017274916636], "isController": false}, {"data": ["deleteBook", 12, 2, 16.666666666666668, 609.25, 153, 1467, 552.0, 1324.5000000000005, 1467.0, 1467.0, 0.0848704311417902, 0.016949221844234467, 0.05700850737665498], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 2, 16.666666666666668, 609.25, 153, 1467, 552.0, 1324.5000000000005, 1467.0, 1467.0, 0.08521577343966368, 0.017018189129307835, 0.05724047802498243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 256.35, 138, 440, 147.5, 439.40000000000003, 440.0, 440.0, 0.09707135715464438, 0.03326400314996554, 0.054953384514206394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/215399a6-35d4-458f-a8f5-ccd343084d9c", 3, 0, 0.0, 373.0, 268, 484, 367.0, 484.0, 484.0, 484.0, 0.03230808994572241, 0.03240274255298527, 0.0207184040342035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 160.95, 143, 428, 148.0, 151.0, 414.1499999999998, 428.0, 0.0972062911911659, 0.07224022226218481, 0.04879300163306569], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 224.09999999999997, 141, 856, 148.0, 442.0, 835.3499999999997, 856.0, 0.0972062911911659, 1.453983984655987, 0.056823912018585845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 292.1, 140, 1632, 148.5, 441.9, 1572.499999999999, 1632.0, 0.09706805926975699, 4.391955249501313, 0.05664831271445975], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/05ab782f-3ef1-45e4-8560-a1e09d2749fc", 3, 0, 0.0, 366.0, 231, 457, 410.0, 457.0, 457.0, 457.0, 0.018705457629020896, 0.025786983417611813, 0.01199536182590207], "isController": false}, {"data": ["goToProfile", 12, 2, 16.666666666666668, 382.0, 145, 1802, 267.0, 1374.8000000000015, 1802.0, 1802.0, 0.08632348286478865, 0.16946463030170056, 0.05579273282162691], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 161.05263157894737, 139, 418, 147.0, 155.0, 418.0, 418.0, 0.11352026336701102, 0.08436418009989782, 0.056981850947894194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 1042.6666666666667, 864, 1137, 1127.0, 1137.0, 1137.0, 1137.0, 0.024504398539537845, 7.205106793231884, 0.013975164792080177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 173.8421052631579, 137, 447, 143.0, 424.0, 447.0, 447.0, 0.11351483758416527, 0.030374087400450476, 0.06473893080971926], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1680.3333333333333, 1574, 1736, 1731.0, 1736.0, 1736.0, 1736.0, 0.024331097575811644, 21.893164368222774, 0.0138525682487287], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 144.33333333333334, 141, 148, 144.0, 148.0, 148.0, 148.0, 0.024649767881352452, 0.04361853457129945, 0.013648846082741055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 183.66666666666669, 139, 428, 146.0, 426.8, 428.0, 428.0, 0.08642096226860788, 0.06422495340469785, 0.043379272076234814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 242.86666666666665, 141, 447, 147.0, 445.2, 447.0, 447.0, 0.08642494569632579, 0.049086668375960034, 0.04783755783269283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 452.2, 139, 1544, 146.0, 1501.4, 1544.0, 1544.0, 0.08622275360985927, 15.535268833564219, 0.04920759493125173], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 413.80000000000007, 137, 1181, 427.0, 998.6000000000001, 1181.0, 1181.0, 0.08621680652948614, 5.088711256322566, 0.049288397014024606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 144.66666666666666, 142, 146, 146.0, 146.0, 146.0, 146.0, 0.02464875523786049, 0.018318069078136556, 0.013840853771259553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 160.1578947368421, 138, 427, 144.0, 162.0, 427.0, 427.0, 0.11351348121949326, 0.03059543048494154, 0.06673351142005365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 1026.0666666666668, 137, 1843, 1531.0, 1768.6000000000001, 1843.0, 1843.0, 0.09102107441276236, 49.150366862336696, 0.04881716217528232], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 191.6842105263158, 138, 447, 146.0, 434.0, 447.0, 447.0, 0.11352026336701102, 0.030597258485639683, 0.06684835821319104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 683.8, 141, 1180, 842.0, 1172.2, 1180.0, 1180.0, 0.09101886517678898, 16.06735405504214, 0.04890486291041923], "isController": false}, {"data": ["deleteBooks", 11, 2, 18.181818181818183, 611.7272727272727, 145, 1181, 538.0, 1137.0000000000002, 1181.0, 1181.0, 0.08757473707675527, 0.017640898297865564, 0.05924356325682486], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9e028634-ccd4-4ffc-af5c-e2b783348de2", 3, 0, 0.0, 354.6666666666667, 279, 470, 315.0, 470.0, 470.0, 470.0, 0.04017893016901936, 0.02583118069134546, 0.025765785297190154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 705.1999999999999, 284, 1692, 586.0, 1647.6000000000001, 1692.0, 1692.0, 0.0861425371848619, 20.71808777924539, 0.18932850994946304], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7cd02b51-82a6-436c-9664-23d161a813d4", 3, 0, 0.0, 334.0, 251, 499, 252.0, 499.0, 499.0, 499.0, 0.05061241016297196, 0.032538903018186724, 0.03245652604852043], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 559.4736842105264, 155, 1753, 537.0, 883.0, 1753.0, 1753.0, 0.0931779060472461, 0.05723525674191191, 0.042130244628784126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 164.6, 137, 441, 145.0, 268.80000000000007, 441.0, 441.0, 0.09101555152390371, 0.06763948702118236, 0.045685540511021985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 257.4, 137, 440, 145.0, 438.8, 440.0, 440.0, 0.09101831288455238, 0.10637765318382059, 0.04732241189427313], "isController": false}, {"data": ["login", 19, 0, 0.0, 2657.0, 1537, 4785, 2552.0, 3819.0, 4785.0, 4785.0, 0.09510033084904575, 18.097378867517733, 0.1683856546781855], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 150.31578947368425, 144, 165, 150.0, 158.0, 165.0, 165.0, 0.11885399724759164, 0.0962206676936069, 0.042248881834104836], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=75d0afdf-3165-43c4-a6f6-3de91333cc39", 1, 0, 0.0, 1181.0, 1181, 1181, 1181.0, 1181.0, 1181.0, 1181.0, 0.8467400508044031, 0.15297549745977984, 0.5837875740897545], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/00ecd639-0ce3-4646-8c97-27ec7b762356", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 1.1960147471910112, 2.234755383895131], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5bd32d58-4a87-4aeb-99f6-274e00ddee25", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 1.3474090189873418, 2.517635812236287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1211.5333333333333, 294, 1989, 1676.0, 1914.6000000000001, 1989.0, 1989.0, 0.09093664746892997, 65.33148065701728, 0.19055845521370113], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b33d2222-f826-4e3e-a96e-1d03830209ce", 1, 0, 0.0, 341.0, 341, 341, 341.0, 341.0, 341.0, 341.0, 2.932551319648094, 0.9364690249266862, 1.7497938049853372], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/248de8ff-3e19-44ca-a99e-a4b68a39bf18", 3, 0, 0.0, 458.0, 281, 764, 329.0, 764.0, 764.0, 764.0, 0.029612081729345572, 0.029698835875037015, 0.01898951855690455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b3229019-453d-496f-9d5f-856e280143a3", 3, 0, 0.0, 871.6666666666666, 297, 1319, 999.0, 1319.0, 1319.0, 1319.0, 0.019072928521021545, 0.022543555813746497, 0.012231012104951968], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3a5729c2-9209-4f8d-98b9-5ea3b68999c8", 1, 0, 0.0, 594.0, 594, 594, 594.0, 594.0, 594.0, 594.0, 1.6835016835016834, 0.3041482533670034, 1.1606954966329968], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 4, 57.142857142857146, 865.8571428571429, 144, 1883, 148.0, 1883.0, 1883.0, 1883.0, 0.031567934194386325, 16.190351401841763, 0.042459047651796665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 539.5500000000001, 288, 1776, 566.0, 841.4000000000005, 1730.6499999999994, 1776.0, 0.09699791454483729, 5.944972817850041, 0.21690969191037393], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cbccf1b0-b9b4-46f8-a88a-b5cd99f33dc6", 3, 0, 0.0, 927.0, 266, 2049, 466.0, 2049.0, 2049.0, 2049.0, 0.028345742469481083, 0.023630679187611022, 0.018177445528931555], "isController": false}, {"data": ["register", 20, 4, 20.0, 1391.75, 459, 1935, 1431.5, 1712.5, 1924.1, 1935.0, 0.08502244592572439, 0.026968057067065704, 0.03835973634539518], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b3229019-453d-496f-9d5f-856e280143a3", 1, 0, 0.0, 961.0, 961, 961, 961.0, 961.0, 961.0, 961.0, 1.040582726326743, 0.18799590270551508, 0.7174330124869928], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 384.63157894736844, 287, 866, 295.0, 603.0, 866.0, 866.0, 0.11341387708323385, 0.17576935833114465, 0.25507046769793706], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 176.23076923076923, 140, 431, 154.0, 334.5999999999999, 431.0, 431.0, 0.08490849476833044, 0.06592016927814717, 0.03018231649967996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/798d9272-d409-4a59-a90e-a88793faf386", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 1.394480076419214, 2.605588155021834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 431.5882352941176, 283, 861, 303.0, 649.7999999999998, 861.0, 861.0, 0.08535122027141688, 0.1322777212604869, 0.19195689480964168], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 175.63636363636363, 139, 447, 150.0, 389.2000000000002, 447.0, 447.0, 0.06734460233012324, 0.050048088255101354, 0.03380383359148764], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=05ab782f-3ef1-45e4-8560-a1e09d2749fc", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 145.63636363636365, 139, 151, 144.0, 150.8, 151.0, 151.0, 0.06734419003305987, 0.018019832098689847, 0.03840723337822946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 249.1818181818182, 140, 444, 149.0, 441.6, 444.0, 444.0, 0.06722072842825715, 0.018118086959178686, 0.039518436048643364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 195.36363636363637, 136, 423, 148.0, 420.8, 423.0, 423.0, 0.06734212862346567, 0.01815080810554348, 0.039655569882763475], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 292.0, 145, 439, 292.0, 439.0, 439.0, 439.0, 0.023329872735544228, 0.006880489810678083, 0.014421688907812008], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1672.2909090909088, 1139, 2569, 1493.0, 2359.0, 2473.0, 2569.0, 0.25855827903609474, 309.3255911288655, 0.5105516017685386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 4, 20.0, 1391.75, 459, 1935, 1431.5, 1712.5, 1924.1, 1935.0, 0.08371423309391061, 0.026553108309474778, 0.03776950750916671], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 145.66666666666669, 142, 149, 145.5, 149.0, 149.0, 149.0, 0.03806237153949606, 0.010258998579004796, 0.022413681678043088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 192.0, 139, 443, 142.5, 443.0, 443.0, 443.0, 0.03799103411594863, 0.010239770914064281, 0.022334572790821367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 532.1538461538461, 144, 1763, 150.0, 1681.8, 1763.0, 1763.0, 0.08190988652330336, 17.025288643745547, 0.04652963956499549], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 400.53846153846155, 139, 1183, 146.0, 1172.6, 1183.0, 1183.0, 0.0820681165367255, 5.5856502122723395, 0.04669966817650958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 144.0, 138, 148, 143.5, 148.0, 148.0, 148.0, 0.03806333739342265, 0.010184916450974421, 0.021707997107186357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 149.53846153846155, 142, 169, 149.0, 161.79999999999998, 169.0, 169.0, 0.08206552616627738, 0.06098814981693075, 0.0411930473139322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 146.66666666666666, 139, 150, 147.5, 150.0, 150.0, 150.0, 0.03806237153949606, 0.02828658666167627, 0.019105526339161107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 167.15384615384616, 138, 443, 144.0, 325.7999999999999, 443.0, 443.0, 0.08206604422728507, 0.0504035439905561, 0.045212768056107924], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 150.33333333333334, 147, 153, 150.5, 153.0, 153.0, 153.0, 0.037838178722330834, 0.02978278520527212, 0.013450290092703538], "isController": false}, {"data": ["deleteAccount", 11, 2, 18.181818181818183, 652.5454545454546, 144, 1939, 484.0, 1751.0000000000007, 1939.0, 1939.0, 0.09079503433703118, 0.017838193447074747, 0.06178479564926703], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1390.7894736842104, 906, 2183, 1237.0, 2082.0, 2183.0, 2183.0, 0.09387490921308123, 0.04858759949505181, 0.04317879124937623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 343.3333333333333, 287, 594, 294.0, 594.0, 594.0, 594.0, 0.03795546558704454, 0.05882355848304655, 0.08536273168648785], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0526e1f0-e2b4-4547-b72c-cd11bfbc989f", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 1.2824736445783134, 2.3963039658634537], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9e028634-ccd4-4ffc-af5c-e2b783348de2", 1, 0, 0.0, 759.0, 759, 759, 759.0, 759.0, 759.0, 759.0, 1.3175230566534915, 0.2380290678524374, 0.9083703886693018], "isController": false}, {"data": ["addBook", 61, 12, 19.672131147540984, 1398.8524590163936, 736, 2790, 1164.0, 2408.4, 2521.7, 2790.0, 0.295279402083414, 93.77670864212621, 1.0728932449996127], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=215399a6-35d4-458f-a8f5-ccd343084d9c", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.35217166179337234, 1.3439632066276803], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 252.50909090909084, 137, 611, 150.0, 580.2, 592.4, 611.0, 0.25988876760746404, 0.19313999233328136, 0.1256298241852487], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 910.7454545454545, 682, 1289, 848.0, 1210.8, 1278.2, 1289.0, 0.25962745819997923, 76.33909315374194, 0.13057435641893486], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 197.5454545454546, 138, 598, 148.0, 426.6, 441.79999999999995, 598.0, 0.2604808001970182, 0.4609289159736299, 0.1266791391583155], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1418.3454545454547, 991, 1995, 1341.0, 1835.4, 1917.6, 1995.0, 0.2593189812064462, 233.33567512370695, 0.13016597298839194], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 170.76470588235293, 144, 436, 152.0, 230.3999999999998, 436.0, 436.0, 0.0851063829787234, 0.06358045212765957, 0.030252659574468085], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 12, 6.779661016949152, 209.62711864406785, 139, 1114, 153.0, 359.80000000000007, 437.2, 692.0199999999994, 0.7414295767568111, 1.5459335192666968, 0.3579231973731611], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 151.45454545454547, 141, 164, 151.0, 163.6, 164.0, 164.0, 0.06943786888867848, 0.05377366213742386, 0.024682992456522425], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7cd02b51-82a6-436c-9664-23d161a813d4", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 0.3514865029182879, 1.3413484922178989], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 179.05, 142, 448, 151.0, 401.50000000000057, 447.0, 448.0, 0.09769345746915328, 0.07928053042662732, 0.03472697120973808], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/75d0afdf-3165-43c4-a6f6-3de91333cc39", 3, 0, 0.0, 522.3333333333334, 378, 811, 378.0, 811.0, 811.0, 811.0, 0.020166033677276242, 0.023835569102275404, 0.012931994252680403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 426.3636363636364, 284, 880, 299.0, 823.2000000000003, 880.0, 880.0, 0.0671620375741072, 0.10408804065440248, 0.15104899661442275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 705.3846153846156, 292, 1913, 301.0, 1831.8, 1913.0, 1913.0, 0.08183512111597925, 22.690619275475903, 0.17921719395238456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 187.33333333333331, 142, 423, 151.0, 419.4, 423.0, 423.0, 0.0841670547703081, 0.06978303662108552, 0.029918757750382958], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=248de8ff-3e19-44ca-a99e-a4b68a39bf18", 1, 0, 0.0, 538.0, 538, 538, 538.0, 538.0, 538.0, 538.0, 1.858736059479554, 0.3358068076208178, 1.2815113847583641], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 169.46666666666667, 143, 445, 148.0, 276.4000000000001, 445.0, 445.0, 0.09090413250186354, 0.07057498568259914, 0.03231357835027181], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cbccf1b0-b9b4-46f8-a88a-b5cd99f33dc6", 1, 0, 0.0, 603.0, 603, 603, 603.0, 603.0, 603.0, 603.0, 1.658374792703151, 0.2996087271973466, 1.1433716832504146], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a5729c2-9209-4f8d-98b9-5ea3b68999c8", 3, 0, 0.0, 1359.3333333333333, 337, 1939, 1802.0, 1939.0, 1939.0, 1939.0, 0.024718416043899905, 0.02479083327840352, 0.01585132799690196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 163.29411764705884, 138, 433, 146.0, 212.19999999999982, 433.0, 433.0, 0.0855350215598569, 0.06356655410844834, 0.04293457136891255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 178.64705882352945, 137, 443, 145.0, 437.4, 443.0, 443.0, 0.08553545192907602, 0.022887415848209795, 0.04878193742830117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 244.99999999999997, 139, 445, 149.0, 431.4, 445.0, 445.0, 0.08541726333137376, 0.023022621757284336, 0.050216008325670906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 232.88235294117644, 141, 447, 148.0, 444.6, 447.0, 447.0, 0.08541468831175356, 0.023021927709027327, 0.050297907277331445], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 16.666666666666668, 0.3117692907248636], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.333333333333334, 0.1558846453624318], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.333333333333334, 0.1558846453624318], "isController": false}, {"data": ["401/Unauthorized", 16, 66.66666666666667, 1.2470771628994544], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1283, 24, "401/Unauthorized", 16, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
