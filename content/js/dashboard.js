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

    var data = {"OkPercent": 99.44444444444444, "KoPercent": 0.5555555555555556};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7484557309540151, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6b3ec2ae-9a2e-412a-a38c-5fda9620fcb9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=89d88908-b099-4134-8706-2a039d70b0dc"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6363636363636364, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e826354f-92e9-4c09-ac8b-124045154075"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3bc9b06d-01b2-46c1-a8c9-ff685d83daac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e5b97abf-cb75-44f5-8984-8a72839b1df3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5263157894736842, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5ca104d4-fdda-43fd-84a9-6b918bd60926"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=673dd1c6-9c54-4074-8436-9585acf1b836"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.029411764705882353, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b4edf37c-cabc-4799-b00b-b0fddcc0de4e"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d8a88caf-fdfe-49cf-a218-5b96dd00b7ff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0279dc02-7ba3-479d-8bda-b43435d5db18"], "isController": false}, {"data": [0.42105263157894735, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/24a219a0-2c10-4973-8e1b-ed51176f4b9c"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7ca02ca9-6db4-4269-8974-ccde0aedec86"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a3c325c2-af68-4f60-a343-26e0a36689c4"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "register"], "isController": true}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e826354f-92e9-4c09-ac8b-124045154075"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/89d88908-b099-4134-8706-2a039d70b0dc"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d586fedb-6ba7-4a97-9350-81c4b530fa89"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2647058823529412, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0e5c3bd0-8362-473a-ba25-cd33468eb0b3"], "isController": false}, {"data": [0.3416666666666667, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/535aa491-52be-4960-a1e3-e32fe8cf53c2"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3090909090909091, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5ca104d4-fdda-43fd-84a9-6b918bd60926"], "isController": false}, {"data": [0.9742857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=24a219a0-2c10-4973-8e1b-ed51176f4b9c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d8a88caf-fdfe-49cf-a218-5b96dd00b7ff"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7ca02ca9-6db4-4269-8974-ccde0aedec86"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=535aa491-52be-4960-a1e3-e32fe8cf53c2"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0279dc02-7ba3-479d-8bda-b43435d5db18"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b4edf37c-cabc-4799-b00b-b0fddcc0de4e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/673dd1c6-9c54-4074-8436-9585acf1b836"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a3c325c2-af68-4f60-a343-26e0a36689c4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1260, 7, 0.5555555555555556, 476.453968253968, 1, 2715, 157.5, 1315.5000000000005, 1653.8500000000001, 2123.7300000000005, 4.9819503149304305, 684.4264728940881, 3.635544881046051], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 1, 1.8181818181818181, 2391.8909090909087, 1734, 3309, 2384.0, 2838.0, 3019.0, 3309.0, 0.24062860942914144, 289.5645772333069, 1.1805969325868013], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6b3ec2ae-9a2e-412a-a38c-5fda9620fcb9", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 1.1654596259124086, 2.1776630930656933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=89d88908-b099-4134-8706-2a039d70b0dc", 1, 0, 0.0, 564.0, 564, 564, 564.0, 564.0, 564.0, 564.0, 1.7730496453900708, 0.32032635195035464, 1.2224346187943265], "isController": false}, {"data": ["deleteBook", 11, 0, 0.0, 653.5454545454546, 485, 1328, 518.0, 1217.0000000000005, 1328.0, 1328.0, 0.09263391917269488, 0.0167356201630357, 0.06296211693769106], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 0, 0.0, 653.5454545454546, 485, 1328, 518.0, 1217.0000000000005, 1328.0, 1328.0, 0.0911977581932895, 0.01647615748609234, 0.061985976272001454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e826354f-92e9-4c09-ac8b-124045154075", 3, 0, 0.0, 793.0, 241, 1639, 499.0, 1639.0, 1639.0, 1639.0, 0.03504631955234168, 0.02921667460076401, 0.02247436507751078], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 162.1428571428571, 138, 423, 142.5, 284.0, 423.0, 423.0, 0.13518733101583624, 0.036173172556971805, 0.0770990247199691], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 145.35714285714286, 140, 157, 144.5, 153.0, 157.0, 157.0, 0.135189941868325, 0.10046830640800324, 0.06785901378937406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 244.6428571428572, 141, 436, 144.5, 435.5, 436.0, 436.0, 0.13518863642947498, 0.03643756216263193, 0.07960815211618498], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 182.85714285714283, 138, 434, 141.0, 431.5, 434.0, 434.0, 0.1351925528216617, 0.03643861775271351, 0.07947843437367222], "isController": false}, {"data": ["goToProfile", 11, 0, 0.0, 289.09090909090907, 229, 452, 262.0, 434.80000000000007, 452.0, 452.0, 0.0922911702520388, 0.24204309840336274, 0.05966479951840789], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3bc9b06d-01b2-46c1-a8c9-ff685d83daac", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 1.1915520055970148, 2.226416744402985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 160.05555555555554, 141, 428, 145.0, 176.9000000000004, 428.0, 428.0, 0.09487065966732022, 0.0705044648504206, 0.04762062409082284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 175.38888888888889, 140, 428, 144.5, 426.2, 428.0, 428.0, 0.0947338505099839, 0.025348706093491786, 0.05402789911897519], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 1, 0, 0.0, 838.0, 838, 838, 838.0, 838.0, 838.0, 838.0, 1.1933174224343677, 350.87494406324583, 0.6805638424821002], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 1, 0, 0.0, 1441.0, 1441, 1441, 1441.0, 1441.0, 1441.0, 1441.0, 0.6939625260235947, 624.4287007720333, 0.3950978053435114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 4.049270594965675, 1.2670730835240274], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e5b97abf-cb75-44f5-8984-8a72839b1df3", 1, 0, 0.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 243.0, 4.11522633744856, 1.3141396604938271, 2.455471965020576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 18, 0, 0.0, 160.44444444444443, 140, 431, 144.5, 179.0000000000004, 431.0, 431.0, 0.09288596699451973, 0.0690295125808882, 0.046624401401546035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 18, 0, 0.0, 205.61111111111114, 139, 427, 143.5, 427.0, 427.0, 427.0, 0.0928921986035206, 0.032607016328384246, 0.05254416572484299], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 18, 0, 0.0, 245.88888888888889, 140, 1718, 142.0, 560.6000000000018, 1718.0, 1718.0, 0.09289123984002065, 4.667185080957296, 0.05416639788414398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 18, 0, 0.0, 273.77777777777777, 138, 827, 146.5, 474.20000000000056, 827.0, 827.0, 0.09275099449677432, 1.5387144422315888, 0.05417519567883422], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 1, 0, 0.0, 147.0, 147, 147, 147.0, 147.0, 147.0, 147.0, 6.802721088435374, 5.055537840136055, 3.819887329931973], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 175.0, 139, 427, 144.5, 422.5, 427.0, 427.0, 0.09487365990955376, 0.025571416147496917, 0.05577533522026502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 968.157894736842, 139, 1948, 1288.0, 1875.0, 1948.0, 1948.0, 0.1026877158468764, 48.64394579912662, 0.05572455303820524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 243.61111111111111, 139, 555, 145.0, 441.6000000000002, 555.0, 555.0, 0.09487315985600363, 0.025571281367438477, 0.05586769081364276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 696.1052631578948, 142, 1286, 821.0, 1269.0, 1286.0, 1286.0, 0.10268549594392291, 15.904133969442958, 0.055823627189497974], "isController": false}, {"data": ["deleteBooks", 11, 0, 0.0, 548.0, 473, 640, 537.0, 638.8, 640.0, 640.0, 0.09122725538655475, 0.01648148656885999, 0.06289691631143327], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5ca104d4-fdda-43fd-84a9-6b918bd60926", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 0.36205222945891785, 1.3816695891783568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 0, 0.0, 487.8333333333333, 285, 1860, 294.0, 959.1000000000014, 1860.0, 1860.0, 0.09267792875126789, 6.295376586144135, 0.20711747184907914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=673dd1c6-9c54-4074-8436-9585acf1b836", 1, 0, 0.0, 613.0, 613, 613, 613.0, 613.0, 613.0, 613.0, 1.6313213703099512, 0.29472114600326266, 1.124719616639478], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 17, 0, 0.0, 580.5294117647059, 152, 1052, 545.0, 970.4, 1052.0, 1052.0, 0.08463985740673434, 0.05199069366097256, 0.03826977927667773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 161.05263157894737, 140, 434, 146.0, 160.0, 434.0, 434.0, 0.10268882583434671, 0.07631464498040805, 0.05154497703013106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 243.3157894736842, 138, 602, 146.0, 436.0, 602.0, 602.0, 0.10268605091066313, 0.1086500331027401, 0.05402417851159271], "isController": false}, {"data": ["login", 17, 0, 0.0, 2596.9411764705883, 1358, 4672, 2420.0, 3995.9999999999995, 4672.0, 4672.0, 0.08420093314445909, 6.046113592940495, 0.1352545205375982], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 165.55555555555554, 143, 434, 147.5, 204.50000000000037, 434.0, 434.0, 0.09526632229655348, 0.07712478631234652, 0.033864200503853], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b4edf37c-cabc-4799-b00b-b0fddcc0de4e", 3, 0, 0.0, 334.6666666666667, 253, 488, 263.0, 488.0, 488.0, 488.0, 0.039637973178304815, 0.025741457190988967, 0.025418882539472814], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d8a88caf-fdfe-49cf-a218-5b96dd00b7ff", 3, 0, 0.0, 551.0, 229, 902, 522.0, 902.0, 902.0, 902.0, 0.03600057600921615, 0.030012198945183127, 0.023086306880910096], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0279dc02-7ba3-479d-8bda-b43435d5db18", 3, 0, 0.0, 367.3333333333333, 255, 481, 366.0, 481.0, 481.0, 481.0, 0.019246808237633927, 0.02653327893436838, 0.012342517001347275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 1133.5263157894738, 288, 2093, 1436.0, 2024.0, 2093.0, 2093.0, 0.10260508921242494, 64.68130213789854, 0.21694415886777985], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/24a219a0-2c10-4973-8e1b-ed51176f4b9c", 3, 0, 0.0, 405.0, 285, 641, 289.0, 641.0, 641.0, 641.0, 0.01650155939736305, 0.02274873178640382, 0.010582054691668364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 431.5, 284, 583, 426.5, 582.0, 583.0, 583.0, 0.1350009160776448, 0.20922505255392804, 0.3036202243425937], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 1, 0, 0.0, 1589.0, 1589, 1589, 1589.0, 1589.0, 1589.0, 1589.0, 0.6293266205160478, 752.893427470107, 1.419057780050346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7ca02ca9-6db4-4269-8974-ccde0aedec86", 3, 0, 0.0, 817.6666666666666, 283, 1201, 969.0, 1201.0, 1201.0, 1201.0, 0.0245565496410651, 0.024628492657591657, 0.01574752695081323], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a3c325c2-af68-4f60-a343-26e0a36689c4", 3, 0, 0.0, 395.3333333333333, 234, 618, 334.0, 618.0, 618.0, 618.0, 0.02880737468792011, 0.028891771293451125, 0.018473479210677934], "isController": false}, {"data": ["register", 21, 3, 14.285714285714286, 1410.0952380952383, 302, 2559, 1316.0, 2412.6000000000004, 2549.2999999999997, 2559.0, 0.08859787533857044, 0.028280125387088337, 0.039972869537519086], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 438.3888888888889, 287, 857, 298.5, 713.0000000000002, 857.0, 857.0, 0.09465762861605288, 0.1467008365367929, 0.21288722529567364], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 147.21428571428572, 141, 152, 148.0, 151.0, 152.0, 152.0, 0.08066235315130528, 0.06262360425321066, 0.028672945846753055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 611.1666666666666, 288, 2077, 565.5, 1714.3000000000006, 2077.0, 2077.0, 0.10719709376768008, 14.397118705892863, 0.23804128949170714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 145.125, 140, 149, 146.0, 149.0, 149.0, 149.0, 0.04680059436754847, 0.03478051983760194, 0.023491704594648354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 212.125, 140, 423, 144.0, 423.0, 423.0, 423.0, 0.04680141574282622, 0.012523035071810922, 0.02669143241583058], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e826354f-92e9-4c09-ac8b-124045154075", 1, 0, 0.0, 537.0, 537, 537, 537.0, 537.0, 537.0, 537.0, 1.86219739292365, 0.33643214618249534, 1.2838978119180633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 214.875, 137, 429, 145.5, 429.0, 429.0, 429.0, 0.04672214921886407, 0.012593079281646956, 0.02746751350562126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 216.25, 140, 436, 144.5, 436.0, 436.0, 436.0, 0.046721057764747796, 0.012592785100654678, 0.02751249788295207], "isController": false}, {"data": ["https://demoqa.com/books", 55, 1, 1.8181818181818181, 1635.9454545454548, 1125, 2715, 1523.0, 2170.2, 2361.7999999999997, 2715.0, 0.25385630809847776, 299.55598764815977, 0.49895024647139735], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 3, 14.285714285714286, 1410.0952380952383, 302, 2559, 1316.0, 2412.6000000000004, 2549.2999999999997, 2559.0, 0.08489993935718616, 0.027099757428744695, 0.03830446482716798], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 201.66666666666666, 140, 486, 145.5, 486.0, 486.0, 486.0, 0.06208223827163049, 0.016733103284150404, 0.036558193044719904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 330.83333333333337, 139, 1277, 142.0, 1277.0, 1277.0, 1277.0, 0.06136663496057194, 9.216751189617788, 0.03519792018246346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 515.5714285714287, 139, 1728, 145.0, 1580.5, 1728.0, 1728.0, 0.08228517691313036, 15.883214512680734, 0.0468593878570589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/89d88908-b099-4134-8706-2a039d70b0dc", 3, 0, 0.0, 456.6666666666667, 406, 512, 452.0, 512.0, 512.0, 512.0, 0.026139234991722576, 0.026215814781737387, 0.01676246514768668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 399.78571428571433, 141, 1116, 146.5, 1116.0, 1116.0, 1116.0, 0.08211047377743369, 5.1909329692613575, 0.04684008472041384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 190.5, 140, 435, 142.0, 435.0, 435.0, 435.0, 0.06189970184976942, 0.016563006159020333, 0.03530217371119663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 165.92857142857142, 142, 429, 145.5, 290.5, 429.0, 429.0, 0.08228082445386102, 0.061148151766980706, 0.041301116962191964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 145.66666666666666, 141, 148, 147.5, 148.0, 148.0, 148.0, 0.06208288064566196, 0.046137765792332766, 0.03116269594909204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 225.07142857142858, 139, 443, 145.0, 439.0, 443.0, 443.0, 0.08228420966016621, 0.04850038864595456, 0.045446873053096824], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d586fedb-6ba7-4a97-9350-81c4b530fa89", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 1.3646834935897436, 2.549913194444444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 194.66666666666669, 142, 438, 146.5, 438.0, 438.0, 438.0, 0.0584231589402039, 0.04598541611894955, 0.020767607279525604], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 703.7272727272726, 474, 1228, 618.0, 1222.6, 1228.0, 1228.0, 0.09290462073800053, 0.016784526207548923, 0.06323683657654919], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 17, 0, 0.0, 1507.9999999999998, 924, 2083, 1454.0, 1999.0, 2083.0, 2083.0, 0.08435133820917148, 0.04365840747154383, 0.03879832060207008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 536.1666666666666, 287, 1425, 291.0, 1425.0, 1425.0, 1425.0, 0.061273258307632604, 9.281173328644227, 0.13692738225322196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e5c3bd0-8362-473a-ba25-cd33468eb0b3", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 1.2876449092741935, 2.4059664818548385], "isController": false}, {"data": ["addBook", 60, 2, 3.3333333333333335, 1467.916666666667, 733, 2949, 1183.5, 2626.4, 2840.4999999999995, 2949.0, 0.2910558536183094, 93.91824297918708, 1.0593172966611044], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/535aa491-52be-4960-a1e3-e32fe8cf53c2", 3, 0, 0.0, 473.6666666666667, 262, 697, 462.0, 697.0, 697.0, 697.0, 0.018421634367401074, 0.021773748173187925, 0.01181335276815759], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 251.83636363636364, 140, 589, 147.0, 584.8, 588.2, 589.0, 0.2550570864133409, 0.18954926050835197, 0.12329419704551145], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 917.4363636363634, 687, 1305, 861.0, 1155.2, 1211.3999999999996, 1305.0, 0.2549353159575602, 74.95944754068536, 0.1282145387872495], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 215.52727272727276, 138, 598, 147.0, 433.2, 437.79999999999995, 598.0, 0.25559639934381434, 0.452285816026359, 0.12430371764962846], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 1, 1.8181818181818181, 1359.1090909090915, 1, 2142, 1300.0, 1764.3999999999999, 1876.6, 2142.0, 0.25456952293671403, 224.90604883945227, 0.12545865906660927], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 168.0, 142, 440, 151.5, 197.0000000000004, 440.0, 440.0, 0.10050026800071467, 0.07508076662162765, 0.03572470464087904], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ca104d4-fdda-43fd-84a9-6b918bd60926", 3, 0, 0.0, 636.3333333333333, 318, 1228, 363.0, 1228.0, 1228.0, 1228.0, 0.022317443313693983, 0.02238282644840207, 0.014311641708325893], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 2, 1.1428571428571428, 218.59428571428572, 141, 680, 151.0, 404.0, 444.4, 630.6000000000006, 0.7465265187548791, 1.5335662651598205, 0.36166960255994607], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 151.5, 145, 161, 148.0, 161.0, 161.0, 161.0, 0.04742145820983995, 0.036723844101956137, 0.016856846473029048], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 190.71428571428572, 143, 459, 148.5, 445.0, 459.0, 459.0, 0.13308870362096337, 0.1080046022549029, 0.047308875115264326], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=24a219a0-2c10-4973-8e1b-ed51176f4b9c", 1, 0, 0.0, 593.0, 593, 593, 593.0, 593.0, 593.0, 593.0, 1.6863406408094435, 0.30466115092748736, 1.1626528246205734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d8a88caf-fdfe-49cf-a218-5b96dd00b7ff", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7ca02ca9-6db4-4269-8974-ccde0aedec86", 1, 0, 0.0, 640.0, 640, 640, 640.0, 640.0, 640.0, 640.0, 1.5625, 0.28228759765625, 1.0772705078125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 433.375, 284, 584, 432.5, 584.0, 584.0, 584.0, 0.04668207175034428, 0.0723480936208949, 0.10498907347758092], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=535aa491-52be-4960-a1e3-e32fe8cf53c2", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 750.0714285714287, 289, 1877, 580.5, 1869.5, 1877.0, 1877.0, 0.08203830016642055, 21.131254367440757, 0.18000814523123082], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 150.44444444444446, 144, 178, 149.0, 160.00000000000003, 178.0, 178.0, 0.09536878579640883, 0.07907040931753037, 0.0339006230760672], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0279dc02-7ba3-479d-8bda-b43435d5db18", 1, 0, 0.0, 634.0, 634, 634, 634.0, 634.0, 634.0, 634.0, 1.5772870662460567, 0.28495908911671924, 1.0874654968454258], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 165.21052631578945, 143, 437, 148.0, 176.0, 437.0, 437.0, 0.10077063013466138, 0.07823501070024981, 0.03582080993068042], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b4edf37c-cabc-4799-b00b-b0fddcc0de4e", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/673dd1c6-9c54-4074-8436-9585acf1b836", 3, 0, 0.0, 338.6666666666667, 257, 474, 285.0, 474.0, 474.0, 474.0, 0.019489884749814848, 0.023036383960474516, 0.012498396144900798], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a3c325c2-af68-4f60-a343-26e0a36689c4", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.35355002446183953, 1.349223336594912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 160.83333333333334, 139, 440, 145.0, 179.9000000000004, 440.0, 440.0, 0.10728846291395465, 0.07973292995851514, 0.053853779236106146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 253.05555555555554, 139, 431, 147.5, 427.4, 431.0, 431.0, 0.1072897419085653, 0.04661329498718483, 0.06018749627466174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 367.22222222222223, 138, 1934, 146.5, 1569.5000000000007, 1934.0, 1934.0, 0.10728782342808438, 10.752123497970473, 0.062049055867153834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 336.0555555555556, 140, 1134, 151.5, 902.7000000000004, 1134.0, 1134.0, 0.10728846291395465, 3.5308567952340084, 0.06215419959826431], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 42.857142857142854, 0.23809523809523808], "isController": false}, {"data": ["Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, 14.285714285714286, 0.07936507936507936], "isController": false}, {"data": ["401/Unauthorized", 2, 28.571428571428573, 0.15873015873015872], "isController": false}, {"data": ["Assertion failed", 1, 14.285714285714286, 0.07936507936507936], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1260, 7, "406/Not Acceptable", 3, "401/Unauthorized", 2, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, "Assertion failed", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books", 55, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 1, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
