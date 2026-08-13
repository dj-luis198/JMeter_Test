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

    var data = {"OkPercent": 98.90880748246298, "KoPercent": 1.0911925175370225};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7218095881161377, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d2dc34bb-9915-43e1-8f9a-e1af402ed52b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3a6e82ed-b8a6-4cbb-b04d-e31c6c61c0c4"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8b8456d0-0825-4b70-9c30-ce05ebf0bad6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a2f7062e-0275-4174-bc2e-f1250d4a5864"], "isController": false}, {"data": [0.875, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/664b9f02-36cf-47ee-9b2b-8800f4ca7089"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6111111111111112, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5454545454545454, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d74ca24c-d1eb-401e-8e69-8035eb086e4e"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8d1f5e66-7a92-45bc-abbd-d3337c0865fd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=52203acf-0001-406b-8ab3-03369d76b36b"], "isController": false}, {"data": [0.5277777777777778, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d74ca24c-d1eb-401e-8e69-8035eb086e4e"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6fbadf41-270d-4052-81ba-48241e938fb3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c82b67a7-4624-48f9-b758-078b60345c02"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/07056356-e5ed-4da8-b78d-95fbaae5ffad"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5156ba04-1b70-481b-a734-07d95adb1525"], "isController": false}, {"data": [0.025, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f0d0c014-6ceb-49f2-9939-96ae9352f8b6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8b8456d0-0825-4b70-9c30-ce05ebf0bad6"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.23275862068965517, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.025, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a2f7062e-0275-4174-bc2e-f1250d4a5864"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.45454545454545453, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.05555555555555555, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4520bb5b-9668-49b5-84a8-8bd3fd7936f7"], "isController": false}, {"data": [0.2719298245614035, 500, 1500, "addBook"], "isController": true}, {"data": [0.9137931034482759, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8d1f5e66-7a92-45bc-abbd-d3337c0865fd"], "isController": false}, {"data": [0.9741379310344828, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.35344827586206895, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9186046511627907, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d2dc34bb-9915-43e1-8f9a-e1af402ed52b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=664b9f02-36cf-47ee-9b2b-8800f4ca7089"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d47c72fc-ce26-487c-b9e9-02e7d995de8f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6fbadf41-270d-4052-81ba-48241e938fb3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/52203acf-0001-406b-8ab3-03369d76b36b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c82b67a7-4624-48f9-b758-078b60345c02"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f0d0c014-6ceb-49f2-9939-96ae9352f8b6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5156ba04-1b70-481b-a734-07d95adb1525"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1283, 14, 1.0911925175370225, 507.9688230709271, 136, 4559, 177.0, 1391.800000000001, 1726.7999999999997, 2814.2800000000047, 5.069463103159425, 702.9267078507037, 3.71837620488652], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 2375.5344827586214, 1713, 3325, 2340.5, 2845.2000000000003, 3029.5999999999995, 3325.0, 0.25922830415525094, 311.93905303034535, 1.2746235463102427], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d2dc34bb-9915-43e1-8f9a-e1af402ed52b", 3, 0, 0.0, 970.0, 231, 2130, 549.0, 2130.0, 2130.0, 2130.0, 0.039456032827419316, 0.025366427354867556, 0.025302208551437513], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a6e82ed-b8a6-4cbb-b04d-e31c6c61c0c4", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.769484186746988, 1.4377823795180724], "isController": false}, {"data": ["deleteBook", 11, 0, 0.0, 728.3636363636364, 535, 1011, 689.0, 1006.0, 1011.0, 1011.0, 0.07833809296595141, 0.014152878123731456, 0.0532454225627951], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 0, 0.0, 728.3636363636364, 535, 1011, 689.0, 1006.0, 1011.0, 1011.0, 0.08056955349818352, 0.014556022848792923, 0.054762118393296616], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8b8456d0-0825-4b70-9c30-ce05ebf0bad6", 3, 0, 0.0, 532.0, 297, 757, 542.0, 757.0, 757.0, 757.0, 0.027135078420376636, 0.02721457572043633, 0.017401075679733712], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 176.35294117647058, 138, 450, 140.0, 435.59999999999997, 450.0, 450.0, 0.08144102711507138, 0.036182496766312154, 0.04564215651049152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 142.52941176470588, 138, 149, 141.0, 148.2, 149.0, 149.0, 0.08144024681185387, 0.06052346467169999, 0.04087918638798134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 323.4705882352941, 137, 1156, 145.0, 1115.2, 1156.0, 1156.0, 0.08133154084996244, 2.8327745776740136, 0.0470711899163242], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 377.8235294117647, 137, 1624, 145.0, 1532.8, 1624.0, 1624.0, 0.0814414172722874, 8.640677996804621, 0.047055249019109985], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a2f7062e-0275-4174-bc2e-f1250d4a5864", 1, 0, 0.0, 594.0, 594, 594, 594.0, 594.0, 594.0, 594.0, 1.6835016835016834, 0.3041482533670034, 1.1606954966329968], "isController": false}, {"data": ["goToProfile", 12, 1, 8.333333333333334, 317.9166666666667, 231, 550, 294.5, 508.0000000000001, 550.0, 550.0, 0.07595225135131714, 0.17704267052862768, 0.04909576273466081], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/664b9f02-36cf-47ee-9b2b-8800f4ca7089", 3, 0, 0.0, 533.3333333333334, 242, 686, 672.0, 686.0, 686.0, 686.0, 0.042186972662841715, 0.027122158531612105, 0.027053494839127012], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 163.23529411764707, 139, 413, 144.0, 238.59999999999985, 413.0, 413.0, 0.09253815838177978, 0.06877103371927189, 0.0464498177814793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 179.0, 138, 445, 144.0, 421.0, 445.0, 445.0, 0.0924073751956862, 0.024726192191033225, 0.05270108116628979], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 962.3333333333334, 859, 1157, 871.0, 1157.0, 1157.0, 1157.0, 0.06310608132270347, 18.555283227981235, 0.035990187004354315], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1506.0, 1250, 1749, 1519.0, 1749.0, 1749.0, 1749.0, 0.061946354457040206, 55.739438630520965, 0.03526828578950628], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 421.3333333333333, 412, 432, 420.0, 432.0, 432.0, 432.0, 0.06369426751592357, 0.11270899681528662, 0.03526821257961783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 197.0625, 138, 533, 148.0, 455.30000000000007, 533.0, 533.0, 0.08425487098472881, 0.06261519220642443, 0.042291995787256446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 179.6875, 137, 435, 144.0, 434.3, 435.0, 435.0, 0.08412463064029359, 0.02250991093304731, 0.04797732841204244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 196.00000000000003, 138, 431, 146.5, 419.8, 431.0, 431.0, 0.0842517653377706, 0.02270848362619598, 0.04953082298177529], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 239.625, 138, 562, 144.5, 478.7000000000001, 562.0, 562.0, 0.08412463064029359, 0.022674216852266633, 0.04953823464462602], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 331.3333333333333, 140, 434, 420.0, 434.0, 434.0, 434.0, 0.06407381303261357, 0.047617355193182546, 0.035978947747805474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 926.5000000000002, 139, 1875, 1354.0, 1823.7, 1875.0, 1875.0, 0.09054417046449159, 45.272959627989216, 0.04890721360375859], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 197.8823529411764, 138, 432, 146.0, 424.0, 432.0, 432.0, 0.09254672248504281, 0.024944233794796697, 0.05440735052343337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 717.5555555555554, 137, 1291, 1103.5, 1177.6000000000001, 1291.0, 1291.0, 0.09054553685957896, 14.80162117382228, 0.048996375034583366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 242.99999999999997, 136, 440, 146.0, 435.2, 440.0, 440.0, 0.09239481936812814, 0.024903291157815786, 0.05440827742088014], "isController": false}, {"data": ["deleteBooks", 11, 0, 0.0, 680.3636363636364, 448, 1159, 617.0, 1107.8000000000002, 1159.0, 1159.0, 0.08077129241410708, 0.014592469820908015, 0.05568801996519491], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d74ca24c-d1eb-401e-8e69-8035eb086e4e", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.35846044146825395, 1.3679625496031746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 440.9375, 280, 1095, 302.5, 925.6000000000001, 1095.0, 1095.0, 0.08406231118816823, 0.13028016392150682, 0.1890581080726088], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8d1f5e66-7a92-45bc-abbd-d3337c0865fd", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 0.3467640355086372, 1.3233265355086372], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=52203acf-0001-406b-8ab3-03369d76b36b", 1, 0, 0.0, 682.0, 682, 682, 682.0, 682.0, 682.0, 682.0, 1.466275659824047, 0.26490331744868034, 1.010928335777126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 18, 0, 0.0, 945.2222222222224, 184, 2863, 825.0, 1852.3000000000015, 2863.0, 2863.0, 0.08267651435815467, 0.050784694854764924, 0.03738205678498594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 148.44444444444446, 139, 205, 146.0, 158.20000000000007, 205.0, 205.0, 0.09054325955734406, 0.06728849660462777, 0.045448472082494966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 228.49999999999997, 137, 562, 146.0, 469.3000000000001, 562.0, 562.0, 0.09054599233377264, 0.09978136915601074, 0.04741481760012877], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d74ca24c-d1eb-401e-8e69-8035eb086e4e", 3, 0, 0.0, 571.6666666666666, 308, 748, 659.0, 748.0, 748.0, 748.0, 0.02300084336425669, 0.02718621818216668, 0.014749889787625545], "isController": false}, {"data": ["login", 18, 0, 0.0, 4257.388888888889, 2321, 8121, 4027.0, 7117.500000000002, 8121.0, 8121.0, 0.07956785812166808, 15.976368587880488, 0.14204105922500906], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 216.47058823529414, 140, 601, 150.0, 486.5999999999999, 601.0, 601.0, 0.09467534709652987, 0.07664635033498365, 0.0336541272882196], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6fbadf41-270d-4052-81ba-48241e938fb3", 1, 0, 0.0, 1159.0, 1159, 1159, 1159.0, 1159.0, 1159.0, 1159.0, 0.8628127696289906, 0.15587926013805004, 0.5948689603106125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c82b67a7-4624-48f9-b758-078b60345c02", 1, 0, 0.0, 597.0, 597, 597, 597.0, 597.0, 597.0, 597.0, 1.6750418760469012, 0.3026198701842546, 1.1548628559463987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1092.2777777777778, 282, 2022, 1506.5, 1975.2, 2022.0, 2022.0, 0.09047726758651889, 60.19691371987233, 0.19062468584282088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/07056356-e5ed-4da8-b78d-95fbaae5ffad", 1, 0, 0.0, 299.0, 299, 299, 299.0, 299.0, 299.0, 299.0, 3.3444816053511706, 1.068013168896321, 1.9955842391304348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 558.8823529411765, 280, 1763, 295.0, 1679.8, 1763.0, 1763.0, 0.08127671374341419, 11.550579851084327, 0.18034671540480585], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 1, 25.0, 1444.5, 264, 2183, 1665.5, 2183.0, 2183.0, 2183.0, 0.034893052793188876, 31.310500600814756, 0.06464074330925713], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5156ba04-1b70-481b-a734-07d95adb1525", 1, 0, 0.0, 759.0, 759, 759, 759.0, 759.0, 759.0, 759.0, 1.3175230566534915, 0.2380290678524374, 0.9083703886693018], "isController": false}, {"data": ["register", 20, 5, 25.0, 1768.9500000000005, 179, 3509, 1747.0, 2977.3, 3482.5999999999995, 3509.0, 0.08240354664864775, 0.025992524968274634, 0.03717816264812038], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f0d0c014-6ceb-49f2-9939-96ae9352f8b6", 3, 0, 0.0, 368.6666666666667, 242, 572, 292.0, 572.0, 572.0, 572.0, 0.04027548431269886, 0.0327369415132842, 0.025827703156255457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8b8456d0-0825-4b70-9c30-ce05ebf0bad6", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 479.52941176470586, 286, 853, 555.0, 643.3999999999999, 853.0, 853.0, 0.09231704932988684, 0.14307339578762734, 0.20762320762375916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 157.76923076923077, 147, 187, 151.0, 181.79999999999998, 187.0, 187.0, 0.10549293603070656, 0.08190125404727706, 0.03749944210466522], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 396.7368421052631, 281, 579, 296.0, 578.0, 579.0, 579.0, 0.10988756766760746, 0.1703042674692315, 0.24713971517431638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 181.87499999999997, 140, 435, 146.5, 435.0, 435.0, 435.0, 0.05390472340138804, 0.04006005323091436, 0.02705764436358736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 177.875, 138, 428, 142.5, 428.0, 428.0, 428.0, 0.05380285289627482, 0.014396466497636037, 0.030684439542406735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 143.0, 140, 146, 143.5, 146.0, 146.0, 146.0, 0.05390508661873606, 0.014529105377706205, 0.03169029506296788], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 176.0, 138, 417, 141.5, 417.0, 417.0, 417.0, 0.05380683346785042, 0.014502623083131556, 0.03168507869249394], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1596.7931034482754, 1103, 2713, 1513.0, 2237.6000000000004, 2424.7499999999995, 2713.0, 0.2748059775038141, 328.76348711017823, 0.5426344594850705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 5, 25.0, 1768.9500000000005, 179, 3509, 1747.0, 2977.3, 3482.5999999999995, 3509.0, 0.08226762481027028, 0.025949651185270803, 0.03711683853744616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 229.57142857142858, 138, 464, 151.0, 464.0, 464.0, 464.0, 0.044515669515669515, 0.0119983640491453, 0.026213817107371796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 223.71428571428572, 138, 434, 141.0, 434.0, 434.0, 434.0, 0.04459251992330086, 0.012019077635577186, 0.026215524408034298], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 319.84615384615387, 138, 1436, 145.0, 1095.1999999999998, 1436.0, 1436.0, 0.09889390965660992, 6.869597979616444, 0.0574850565597091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 268.9230769230769, 137, 1099, 144.0, 888.5999999999998, 1099.0, 1099.0, 0.09889390965660992, 2.2613810011486906, 0.05758163264335813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 269.0, 137, 453, 157.0, 453.0, 453.0, 453.0, 0.04450406576429375, 0.011908314472086415, 0.02538122500619878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 167.6923076923077, 138, 435, 146.0, 323.7999999999999, 435.0, 435.0, 0.09867547155489773, 0.07333206430984097, 0.04953046130782952], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a2f7062e-0275-4174-bc2e-f1250d4a5864", 3, 0, 0.0, 1240.0, 262, 3091, 367.0, 3091.0, 3091.0, 3091.0, 0.02164127423822715, 0.021704676408846952, 0.013878030680113113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 142.85714285714286, 140, 153, 141.0, 153.0, 153.0, 153.0, 0.04459251992330086, 0.03313955826331246, 0.022383354727125628], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 207.07692307692307, 139, 421, 144.0, 417.8, 421.0, 421.0, 0.09889315735422768, 0.03788725229165874, 0.055761120725723624], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 223.14285714285714, 151, 416, 178.0, 416.0, 416.0, 416.0, 0.04572862023687425, 0.035993425694258445, 0.016255095474826394], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 1034.7272727272727, 549, 3091, 757.0, 2697.4000000000015, 3091.0, 3091.0, 0.07825783823393402, 0.014138378977810345, 0.05326729809477736], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 18, 0, 0.0, 2184.944444444445, 1098, 3263, 2006.5, 3245.9, 3263.0, 3263.0, 0.08146934489594554, 0.04216675077622181, 0.03747271625584995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 463.14285714285717, 287, 607, 574.0, 607.0, 607.0, 607.0, 0.044463923877762324, 0.06891039765039922, 0.10000040692430334], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4520bb5b-9668-49b5-84a8-8bd3fd7936f7", 1, 0, 0.0, 343.0, 343, 343, 343.0, 343.0, 343.0, 343.0, 2.9154518950437316, 0.9310085641399416, 1.7395909256559765], "isController": false}, {"data": ["addBook", 57, 8, 14.035087719298245, 1490.0350877192984, 739, 3927, 1229.0, 2559.6000000000004, 2720.299999999999, 3927.0, 0.2905435713411899, 80.3515698671273, 1.059268459392713], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 241.8793103448277, 140, 637, 148.5, 560.7, 569.5999999999999, 637.0, 0.2761247322066175, 0.2052059777433944, 0.1334782641037848], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 896.4310344827586, 683, 1296, 835.5, 1195.2, 1278.55, 1296.0, 0.2759985914554643, 81.15274990363842, 0.13880788535113683], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8d1f5e66-7a92-45bc-abbd-d3337c0865fd", 3, 0, 0.0, 677.6666666666666, 360, 1123, 550.0, 1123.0, 1123.0, 1123.0, 0.017376295258009024, 0.023954625787001374, 0.011143001841887297], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 236.6379310344827, 138, 571, 147.5, 461.5, 555.15, 571.0, 0.27671623704085385, 0.48965802882619835, 0.134574888717134], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1352.8793103448277, 954, 2144, 1349.5, 1753.0, 1911.4999999999998, 2144.0, 0.27558288155162664, 247.96996124318764, 0.13832968859134384], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 164.1052631578947, 140, 436, 148.0, 162.0, 436.0, 436.0, 0.1092293010474515, 0.08160196806767618, 0.03882760310671128], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 8, 4.651162790697675, 257.5755813953487, 139, 2052, 159.0, 419.5000000000001, 553.8, 2009.6600000000005, 0.7519651647765527, 1.6075151021492213, 0.35971607576923414], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 185.625, 141, 426, 151.5, 426.0, 426.0, 426.0, 0.052840158520475564, 0.04092016182298547, 0.018783025099075295], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d2dc34bb-9915-43e1-8f9a-e1af402ed52b", 1, 0, 0.0, 617.0, 617, 617, 617.0, 617.0, 617.0, 617.0, 1.6207455429497568, 0.2928104740680713, 1.1174280794165317], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=664b9f02-36cf-47ee-9b2b-8800f4ca7089", 1, 0, 0.0, 700.0, 700, 700, 700.0, 700.0, 700.0, 700.0, 1.4285714285714286, 0.25809151785714285, 0.9849330357142858], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 150.58823529411762, 142, 189, 148.0, 162.59999999999997, 189.0, 189.0, 0.08385537414294875, 0.06805060147733438, 0.029807965027376315], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d47c72fc-ce26-487c-b9e9-02e7d995de8f", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 1.2188394561068703, 2.27740338740458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6fbadf41-270d-4052-81ba-48241e938fb3", 3, 0, 0.0, 1915.0, 273, 4559, 913.0, 4559.0, 4559.0, 4559.0, 0.01631152844458702, 0.022486758776961595, 0.010460192394478002], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 361.875, 281, 863, 292.5, 863.0, 863.0, 863.0, 0.05374971445464196, 0.08330155941359062, 0.1208843675674223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 544.6923076923076, 280, 1583, 326.0, 1289.7999999999997, 1583.0, 1583.0, 0.09856624030449386, 9.2117378175918, 0.21973785408026325], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 191.43749999999997, 141, 434, 157.0, 433.3, 434.0, 434.0, 0.08289081725165133, 0.06872490610024608, 0.029465095194922936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/52203acf-0001-406b-8ab3-03369d76b36b", 3, 0, 0.0, 598.3333333333333, 272, 1113, 410.0, 1113.0, 1113.0, 1113.0, 0.04387889425186486, 0.028209901089659206, 0.028138483618546144], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 175.11111111111111, 140, 427, 153.0, 251.50000000000028, 427.0, 427.0, 0.09097571453842461, 0.07063055962699957, 0.032339023527330625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c82b67a7-4624-48f9-b758-078b60345c02", 3, 0, 0.0, 461.66666666666663, 279, 747, 359.0, 747.0, 747.0, 747.0, 0.01812393144320866, 0.024985302624345274, 0.011622443015338888], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f0d0c014-6ceb-49f2-9939-96ae9352f8b6", 1, 0, 0.0, 903.0, 903, 903, 903.0, 903.0, 903.0, 903.0, 1.1074197120708749, 0.20007094407530454, 0.7635139811738648], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 143.26315789473685, 137, 149, 142.0, 148.0, 149.0, 149.0, 0.10997979844754832, 0.08173303380721121, 0.05520470351761703], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5156ba04-1b70-481b-a734-07d95adb1525", 3, 0, 0.0, 1595.0, 327, 3361, 1097.0, 3361.0, 3361.0, 3361.0, 0.024300352355109148, 0.02437154479364951, 0.015583233769389656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 175.94736842105263, 137, 419, 141.0, 412.0, 419.0, 419.0, 0.109982344939365, 0.029428869641978526, 0.0627243060982316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 216.21052631578948, 138, 431, 146.0, 415.0, 431.0, 431.0, 0.10998361822949529, 0.029644022100918654, 0.06465833806069939], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 221.68421052631578, 139, 436, 143.0, 432.0, 436.0, 436.0, 0.10998425488561638, 0.029644193699638787, 0.06476611884377605], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 35.714285714285715, 0.3897116134060795], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 7.142857142857143, 0.0779423226812159], "isController": false}, {"data": ["401/Unauthorized", 8, 57.142857142857146, 0.6235385814497272], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1283, 14, "401/Unauthorized", 8, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
