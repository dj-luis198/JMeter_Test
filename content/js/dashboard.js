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

    var data = {"OkPercent": 97.30538922155688, "KoPercent": 2.694610778443114};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7899106002554278, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3157894736842105, 500, 1500, "see books"], "isController": true}, {"data": [0.6470588235294118, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6470588235294118, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59c91369-1f54-4c86-a27a-a3f83190903e"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/87ab5581-2eac-4212-bb22-fc223d428e75"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6ef5ada1-9e01-4de4-8877-02883d585ccf"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.59375, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=db318055-2018-47bd-b72d-edd57adb1abf"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.041666666666666664, 500, 1500, "login"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/57486163-1fba-4ea2-babd-7095b9ad713d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/aef1c890-fa8b-4c13-8aad-fc04b5aece5d"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d92810cf-69a9-4c03-8b1d-f499327df745"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/07cf5b6c-f911-4b6e-a85d-f3b984da9f3a"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5f8575a1-5cde-401a-a139-8fdc0b5d9536"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7140ad15-bf4e-4806-a68f-662f309b303f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c082a545-b0ed-442e-ae6c-d8de4efc0be8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=075d7470-4cca-4abb-9cd0-8f338b3122cc"], "isController": false}, {"data": [0.3269230769230769, 500, 1500, "register"], "isController": true}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3269230769230769, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.375, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4375, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6ef5ada1-9e01-4de4-8877-02883d585ccf"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=57486163-1fba-4ea2-babd-7095b9ad713d"], "isController": false}, {"data": [0.35964912280701755, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7280701754385965, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e98bc626-6d78-417b-a508-c1dd33555c60"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7140ad15-bf4e-4806-a68f-662f309b303f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aef1c890-fa8b-4c13-8aad-fc04b5aece5d"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=07cf5b6c-f911-4b6e-a85d-f3b984da9f3a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d291874a-4aff-469c-9b84-c1854d4a2e94"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=87ab5581-2eac-4212-bb22-fc223d428e75"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7f8eb1bf-f572-4d7e-8714-7268c6202de1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/59c91369-1f54-4c86-a27a-a3f83190903e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d92810cf-69a9-4c03-8b1d-f499327df745"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/075d7470-4cca-4abb-9cd0-8f338b3122cc"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/38758bd1-92bd-4afb-bdb3-f17ed5b13b26"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5f8575a1-5cde-401a-a139-8fdc0b5d9536"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/db318055-2018-47bd-b72d-edd57adb1abf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c082a545-b0ed-442e-ae6c-d8de4efc0be8"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1336, 36, 2.694610778443114, 325.36826347305345, 98, 3148, 115.0, 803.0, 989.1499999999999, 1334.709999999998, 5.314641918044721, 755.3571570643763, 3.8828091746194024], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1450.9473684210527, 1199, 1871, 1420.0, 1721.6, 1827.7999999999997, 1871.0, 0.2475817345489452, 297.92368052101835, 1.2173574545448622], "isController": true}, {"data": ["deleteBook", 17, 4, 23.529411764705884, 435.2941176470588, 106, 1158, 397.0, 841.9999999999998, 1158.0, 1158.0, 0.08117038140529803, 0.016846770910922668, 0.05425658076930422], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, 23.529411764705884, 435.2941176470588, 106, 1158, 397.0, 841.9999999999998, 1158.0, 1158.0, 0.07961671576364138, 0.016524310320199697, 0.05321806667197445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 11, 0, 0.0, 209.54545454545453, 98, 306, 295.0, 305.6, 306.0, 306.0, 0.10139837578238065, 0.06866715291796871, 0.05550624867490759], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 11, 0, 0.0, 103.45454545454545, 99, 110, 103.0, 109.4, 110.0, 110.0, 0.10140117994100295, 0.07535771282724926, 0.05089863915007375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 11, 0, 0.0, 312.3636363636363, 99, 821, 104.0, 800.2, 821.0, 821.0, 0.10140024520422931, 8.15125099671832, 0.057334708958250755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 11, 0, 0.0, 318.27272727272725, 99, 1010, 103.0, 945.6000000000003, 1010.0, 1010.0, 0.10140117994100295, 24.903775105434182, 0.05723621289638643], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59c91369-1f54-4c86-a27a-a3f83190903e", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["goToProfile", 17, 4, 23.529411764705884, 312.2352941176471, 100, 1067, 232.0, 840.5999999999998, 1067.0, 1067.0, 0.08109178158644145, 0.13494179279618773, 0.052405936514675226], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/87ab5581-2eac-4212-bb22-fc223d428e75", 3, 0, 0.0, 430.0, 210, 848, 232.0, 848.0, 848.0, 848.0, 0.04229879871411652, 0.027689740955106873, 0.02712520620664373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 102.23529411764704, 99, 119, 101.0, 108.6, 119.0, 119.0, 0.10309403388761537, 0.07661578104343292, 0.051748372478744434], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 595.375, 489, 708, 596.5, 708.0, 708.0, 708.0, 0.039438397223536835, 11.596198261752642, 0.02249221091654835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 111.88235294117646, 98, 295, 100.0, 141.39999999999986, 295.0, 295.0, 0.10309403388761537, 0.036694085131414575, 0.058286505142572984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 839.3749999999999, 685, 909, 883.0, 909.0, 909.0, 909.0, 0.039442869468753854, 35.490763281153704, 0.0224562430666831], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 201.0, 100, 306, 199.5, 306.0, 306.0, 306.0, 0.03951807705037073, 0.06992847228053883, 0.02188159149175801], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 116.2, 100, 295, 102.0, 194.80000000000007, 295.0, 295.0, 0.07423500824008591, 0.05516879030342322, 0.03726249437051187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 153.73333333333332, 99, 305, 101.0, 302.6, 305.0, 305.0, 0.07423611042373972, 0.01986395923447723, 0.04233778172603906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 140.13333333333335, 98, 307, 101.0, 300.4, 307.0, 307.0, 0.07416013645465108, 0.019988474278792676, 0.04359804897041011], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 193.4, 99, 305, 103.0, 303.8, 305.0, 305.0, 0.07423611042373972, 0.020008951637648598, 0.04371520955616704], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 151.75, 100, 298, 104.0, 298.0, 298.0, 298.0, 0.039555592913615524, 0.029396295124278726, 0.02221139250520403], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6ef5ada1-9e01-4de4-8877-02883d585ccf", 3, 0, 0.0, 444.0, 218, 714, 400.0, 714.0, 714.0, 714.0, 0.08631354834997268, 0.03905463287970769, 0.055350810628074926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 470.235294117647, 100, 918, 679.0, 910.0, 918.0, 918.0, 0.07818752127160505, 37.255765503263184, 0.04240846598382898], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 158.64705882352942, 98, 684, 100.0, 383.9999999999997, 684.0, 684.0, 0.10309465909021995, 5.4829030110462895, 0.060087224904031004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 423.1176470588235, 98, 816, 494.0, 747.9999999999999, 816.0, 816.0, 0.0781871616680541, 12.18089325670225, 0.04248462558697862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 182.05882352941177, 99, 688, 103.0, 377.59999999999974, 688.0, 688.0, 0.10309278350515465, 1.8092522930563977, 0.06018680829290479], "isController": false}, {"data": ["deleteBooks", 16, 4, 25.0, 457.6875, 105, 1341, 409.0, 1097.4000000000003, 1341.0, 1341.0, 0.07966540529774946, 0.01666827449711213, 0.053505744622585144], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 338.8666666666667, 201, 601, 399.0, 486.4000000000001, 601.0, 601.0, 0.0741223908918406, 0.11487522885288189, 0.16670299435928607], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=db318055-2018-47bd-b72d-edd57adb1abf", 1, 0, 0.0, 551.0, 551, 551, 551.0, 551.0, 551.0, 551.0, 1.8148820326678765, 0.32788396098003625, 1.2512760889292196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 503.5416666666667, 113, 1007, 435.5, 919.5, 1000.0, 1007.0, 0.10319917440660474, 0.06339089912280702, 0.04666134545923632], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 114.41176470588235, 99, 299, 102.0, 146.19999999999987, 299.0, 299.0, 0.07818392538494086, 0.05810348361126952, 0.03924466567173789], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 219.11764705882356, 99, 330, 295.0, 310.0, 330.0, 330.0, 0.07818752127160505, 0.0830922072337255, 0.041114922433379636], "isController": false}, {"data": ["login", 24, 0, 0.0, 2309.916666666666, 1336, 3503, 2194.0, 3060.0, 3427.5, 3503.0, 0.10255489891932774, 41.03501261638913, 0.2114193277526376], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/57486163-1fba-4ea2-babd-7095b9ad713d", 3, 0, 0.0, 628.0, 334, 806, 744.0, 806.0, 806.0, 806.0, 0.025323294054090558, 0.02539748339213965, 0.016239221772968226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 106.05882352941175, 100, 117, 104.0, 116.2, 117.0, 117.0, 0.09996765752256623, 0.08093084774043692, 0.035535378259974715], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aef1c890-fa8b-4c13-8aad-fc04b5aece5d", 3, 0, 0.0, 609.0, 261, 1062, 504.0, 1062.0, 1062.0, 1062.0, 0.030762604977389488, 0.030852729796659182, 0.019727321551255627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 600.4117647058822, 203, 1026, 792.0, 1014.8, 1026.0, 1026.0, 0.07814762546141575, 49.55261561826264, 0.1651703575138942], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d92810cf-69a9-4c03-8b1d-f499327df745", 1, 0, 0.0, 993.0, 993, 993, 993.0, 993.0, 993.0, 993.0, 1.0070493454179255, 0.18193762588116819, 0.6943133182275931], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/07cf5b6c-f911-4b6e-a85d-f3b984da9f3a", 3, 0, 0.0, 485.3333333333333, 217, 877, 362.0, 877.0, 877.0, 877.0, 0.019634664345413014, 0.027067969890242228, 0.012591239830880091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f8575a1-5cde-401a-a139-8fdc0b5d9536", 3, 0, 0.0, 709.6666666666666, 193, 1152, 784.0, 1152.0, 1152.0, 1152.0, 0.020771451716760484, 0.024551152729022564, 0.01332023433659445], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, 50.0, 548.4999999999999, 100, 1207, 457.0, 1063.5000000000002, 1207.0, 1207.0, 0.07883520977556602, 47.167706511295606, 0.11500009238501145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 11, 0, 0.0, 498.09090909090907, 204, 1118, 410.0, 1059.0000000000002, 1118.0, 1118.0, 0.10130312658286135, 33.16702496891836, 0.22076419107151082], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7140ad15-bf4e-4806-a68f-662f309b303f", 3, 0, 0.0, 301.6666666666667, 179, 531, 195.0, 531.0, 531.0, 531.0, 0.04601226993865031, 0.02916207342791411, 0.029506566334355826], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c082a545-b0ed-442e-ae6c-d8de4efc0be8", 3, 0, 0.0, 472.66666666666663, 264, 880, 274.0, 880.0, 880.0, 880.0, 0.029583464815399182, 0.029670135122475544, 0.018971167215604292], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=075d7470-4cca-4abb-9cd0-8f338b3122cc", 1, 0, 0.0, 1341.0, 1341, 1341, 1341.0, 1341.0, 1341.0, 1341.0, 0.7457121551081282, 0.1347233873974646, 0.5141335756897838], "isController": false}, {"data": ["register", 26, 8, 30.76923076923077, 905.4615384615386, 215, 2822, 854.0, 1331.8, 2306.799999999998, 2822.0, 0.10317910702451297, 0.03233648095750211, 0.04655151117707519], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 309.05882352941177, 201, 792, 207.0, 488.7999999999997, 792.0, 792.0, 0.10302967860800845, 7.400831093447918, 0.23016550846661535], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 119.0, 102, 302, 109.0, 121.0, 302.0, 302.0, 0.11316866300159031, 0.08786043660767999, 0.04022792317634656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 285.42105263157896, 202, 1005, 208.0, 506.0, 1005.0, 1005.0, 0.08885895745058973, 5.725529368470036, 0.19864927807943056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 105.77777777777777, 100, 120, 104.0, 120.0, 120.0, 120.0, 0.04652172564587662, 0.03457327462550011, 0.023351725568340417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 124.22222222222223, 100, 297, 103.0, 297.0, 297.0, 297.0, 0.04652653563415668, 0.012449483167733331, 0.026534664853854983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 101.88888888888889, 98, 110, 102.0, 110.0, 110.0, 110.0, 0.0465267761596799, 0.012540420136788721, 0.02735265551574931], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 167.88888888888889, 100, 398, 101.0, 398.0, 398.0, 398.0, 0.04652653563415668, 0.012540355307643794, 0.027397950183004376], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 112.75, 105, 122, 112.0, 122.0, 122.0, 122.0, 0.04406596675222809, 0.012996017538254767, 0.027239997025547247], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 936.140350877193, 779, 1436, 812.0, 1292.0, 1403.7, 1436.0, 0.26290300262903, 314.52339101632765, 0.5191307337069323], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 8, 30.76923076923077, 905.4615384615386, 215, 2822, 854.0, 1331.8, 2306.799999999998, 2822.0, 0.10626775386753315, 0.03330446733288374, 0.047945021764453435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 129.28571428571428, 99, 301, 100.0, 301.0, 301.0, 301.0, 0.033674244975321586, 0.009076261341004647, 0.01982965792980363], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 128.42857142857142, 98, 298, 101.0, 298.0, 298.0, 298.0, 0.03367408298256164, 0.009076217678893566, 0.019796677690920025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 133.05263157894737, 99, 305, 102.0, 302.0, 305.0, 305.0, 0.10597238025121032, 0.02856286811458403, 0.06230016885862169], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 122.7894736842105, 98, 301, 101.0, 298.0, 301.0, 301.0, 0.10597178919422398, 0.02856270880625568, 0.06240330945714556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 100.28571428571429, 98, 103, 100.0, 103.0, 103.0, 103.0, 0.033674244975321586, 0.009010491331287222, 0.019204842837488093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 113.4736842105263, 100, 300, 103.0, 109.0, 300.0, 300.0, 0.10597060710003067, 0.07875354687805014, 0.05319227739200759], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 102.71428571428572, 100, 105, 103.0, 105.0, 105.0, 105.0, 0.03367408298256164, 0.025025368310282622, 0.016902811184606133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 131.8947368421053, 99, 298, 101.0, 298.0, 298.0, 298.0, 0.10597238025121032, 0.028355890809405884, 0.06043737311201838], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 111.57142857142857, 103, 129, 105.0, 129.0, 129.0, 129.0, 0.0339449897195174, 0.026718419642510764, 0.0120663830643597], "isController": false}, {"data": ["deleteAccount", 16, 4, 25.0, 676.375, 100, 2121, 707.0, 1442.7000000000007, 2121.0, 2121.0, 0.0810549299128153, 0.01640491623479587, 0.055151389078861385], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1174.0833333333333, 728, 2226, 1059.5, 1767.0, 2165.75, 2226.0, 0.10397757550288321, 0.053816518570828226, 0.0478256231072832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 233.57142857142858, 201, 403, 207.0, 403.0, 403.0, 403.0, 0.0336577297380467, 0.05216290731863292, 0.07569702303390775], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6ef5ada1-9e01-4de4-8877-02883d585ccf", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 0.9872353142076503, 3.7675034153005464], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=57486163-1fba-4ea2-babd-7095b9ad713d", 1, 0, 0.0, 565.0, 565, 565, 565.0, 565.0, 565.0, 565.0, 1.7699115044247788, 0.3197594026548673, 1.2202710176991152], "isController": false}, {"data": ["addBook", 57, 12, 21.05263157894737, 967.0701754385962, 523, 4394, 832.0, 1435.6000000000001, 1672.5999999999983, 4394.0, 0.2518357500728998, 75.00424386039906, 0.9154804222556531], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 176.10526315789474, 100, 493, 104.0, 408.4, 417.69999999999993, 493.0, 0.263744806078161, 0.19600566154832083, 0.12749382715692353], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 572.0175438596491, 485, 803, 502.0, 712.4, 800.1, 803.0, 0.26370819993708017, 77.5389667178276, 0.13262668258554325], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e98bc626-6d78-417b-a508-c1dd33555c60", 1, 0, 0.0, 1281.0, 1281, 1281, 1281.0, 1281.0, 1281.0, 1281.0, 0.78064012490242, 0.2492864461358314, 0.46579210577673696], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 167.8947368421052, 99, 352, 107.0, 303.4, 308.2, 352.0, 0.26418487379378747, 0.467483389955413, 0.1284805343254943], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 755.1754385964912, 678, 987, 700.0, 905.6, 975.4, 987.0, 0.26346320066189355, 237.0646510744792, 0.13224617689473953], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 130.31578947368422, 102, 307, 111.0, 306.0, 307.0, 307.0, 0.08668911458475914, 0.06476286392318431, 0.0308152712000511], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 12, 7.017543859649122, 174.70760233918128, 99, 3148, 107.0, 295.8000000000001, 381.40000000000026, 1525.1200000000026, 0.728431401783166, 1.6228798013639985, 0.3475757291768725], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 158.88888888888889, 100, 341, 114.0, 341.0, 341.0, 341.0, 0.048579062424095217, 0.037620309084284674, 0.017268338596065098], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7140ad15-bf4e-4806-a68f-662f309b303f", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 0.45507320528967254, 1.7366577455919394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 11, 0, 0.0, 108.0909090909091, 102, 125, 107.0, 122.20000000000002, 125.0, 125.0, 0.09160864785635764, 0.07434256481311836, 0.03256401154268963], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 296.8888888888889, 200, 504, 219.0, 504.0, 504.0, 504.0, 0.04649745038980362, 0.07206196657091636, 0.10457385571066187], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aef1c890-fa8b-4c13-8aad-fc04b5aece5d", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 279.10526315789474, 203, 602, 209.0, 405.0, 602.0, 602.0, 0.10591035524562842, 0.16414036501446513, 0.23819487122136937], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=07cf5b6c-f911-4b6e-a85d-f3b984da9f3a", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.4143671158256881, 1.581314506880734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d291874a-4aff-469c-9b84-c1854d4a2e94", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.6490567835365854, 1.212763592479675], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=87ab5581-2eac-4212-bb22-fc223d428e75", 1, 0, 0.0, 764.0, 764, 764, 764.0, 764.0, 764.0, 764.0, 1.3089005235602096, 0.23647128599476439, 0.9024255562827225], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 106.26666666666667, 103, 116, 105.0, 113.0, 116.0, 116.0, 0.07278055691682153, 0.060342473459356914, 0.025871213591526405], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f8eb1bf-f572-4d7e-8714-7268c6202de1", 1, 0, 0.0, 377.0, 377, 377, 377.0, 377.0, 377.0, 377.0, 2.6525198938992043, 0.8470449270557029, 1.5827047413793103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59c91369-1f54-4c86-a27a-a3f83190903e", 3, 0, 0.0, 410.66666666666663, 184, 862, 186.0, 862.0, 862.0, 862.0, 0.04776689754000478, 0.030709512578616354, 0.0306317669771515], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 117.76470588235294, 101, 305, 105.0, 154.59999999999985, 305.0, 305.0, 0.0762051622273424, 0.059163187471423066, 0.027088553760500622], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d92810cf-69a9-4c03-8b1d-f499327df745", 3, 0, 0.0, 511.66666666666663, 218, 1001, 316.0, 1001.0, 1001.0, 1001.0, 0.036703982382088454, 0.023597124090047102, 0.023537384535388756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/075d7470-4cca-4abb-9cd0-8f338b3122cc", 3, 0, 0.0, 858.0, 178, 2121, 275.0, 2121.0, 2121.0, 2121.0, 0.048282743747384685, 0.03104115198603019, 0.03096256679112885], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/38758bd1-92bd-4afb-bdb3-f17ed5b13b26", 2, 0, 0.0, 663.5, 260, 1067, 663.5, 1067.0, 1067.0, 1067.0, 0.027984944100074162, 0.031592378300474344, 0.0173949383981418], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5f8575a1-5cde-401a-a139-8fdc0b5d9536", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 103.57894736842104, 99, 110, 104.0, 106.0, 110.0, 110.0, 0.08890095030436879, 0.06606799138830531, 0.04462410982074761], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 122.42105263157893, 98, 299, 103.0, 293.0, 299.0, 299.0, 0.08890344617832159, 0.030816449477107363, 0.05030977294527759], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db318055-2018-47bd-b72d-edd57adb1abf", 3, 0, 0.0, 490.0, 298, 700, 472.0, 700.0, 700.0, 700.0, 0.025690650315995, 0.0305160100921438, 0.016474798542483772], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c082a545-b0ed-442e-ae6c-d8de4efc0be8", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 0.46443203727506427, 1.7723730719794344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 168.94736842105263, 99, 901, 100.0, 399.0, 901.0, 901.0, 0.08890344617832159, 4.23298935644433, 0.051863389911798424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 158.0526315789474, 99, 591, 101.0, 301.0, 591.0, 591.0, 0.08890386217093872, 1.3985268425325434, 0.05195045276631386], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 22.22222222222222, 0.5988023952095808], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 11.11111111111111, 0.2994011976047904], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 11.11111111111111, 0.2994011976047904], "isController": false}, {"data": ["401/Unauthorized", 20, 55.55555555555556, 1.4970059880239521], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1336, 36, "401/Unauthorized", 20, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
