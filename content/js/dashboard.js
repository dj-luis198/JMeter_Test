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

    var data = {"OkPercent": 98.95209580838323, "KoPercent": 1.0479041916167664};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8433268858800773, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4727272727272727, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=564a6980-85e6-48cc-9136-ae980adec559"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/03e32c94-806e-4e4d-91aa-e1127f19f19c"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5997fca8-ce1f-47a2-8192-463833db1583"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=700ff5df-d384-4f03-8474-722042ccae92"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c56b1db3-102c-4288-a361-d1b4d65f0f3a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=53a1f0b4-0c8d-4a02-90ce-ceed6e03fbe4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fbaa0136-66a4-480f-89ad-41163b77f1c1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=65e70972-2be8-4ccb-a4f5-7b150b0c0e14"], "isController": false}, {"data": [0.8863636363636364, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.06818181818181818, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3e32d495-a1da-4c43-92eb-e0ec43d124da"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=03e32c94-806e-4e4d-91aa-e1127f19f19c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ce5559e1-2f88-45ae-8907-aac4b157480a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3685b8ba-4a1e-4be9-a205-6c68d974032c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f9668d18-ce8d-47b8-bb5d-e029776aa93a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=578adaa0-a4cc-46dc-a45e-48267056a4c0"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4373eb3c-bcec-4246-b04c-a7cbebacc5c3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/564a6980-85e6-48cc-9136-ae980adec559"], "isController": false}, {"data": [0.4318181818181818, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/700ff5df-d384-4f03-8474-722042ccae92"], "isController": false}, {"data": [0.4375, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5997fca8-ce1f-47a2-8192-463833db1583"], "isController": false}, {"data": [0.8818181818181818, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9508196721311475, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c56b1db3-102c-4288-a361-d1b4d65f0f3a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/19d41ac5-0625-484d-a101-6bd060900ab2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3685b8ba-4a1e-4be9-a205-6c68d974032c"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0a9c6e0b-fa31-4189-910e-27564fb4551a"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ce5559e1-2f88-45ae-8907-aac4b157480a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fbaa0136-66a4-480f-89ad-41163b77f1c1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/65e70972-2be8-4ccb-a4f5-7b150b0c0e14"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3e32d495-a1da-4c43-92eb-e0ec43d124da"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f9668d18-ce8d-47b8-bb5d-e029776aa93a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/578adaa0-a4cc-46dc-a45e-48267056a4c0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/53a1f0b4-0c8d-4a02-90ce-ceed6e03fbe4"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1336, 14, 1.0479041916167664, 265.9461077844314, 0, 1823, 98.5, 710.3, 815.0, 1199.4099999999992, 5.160911503501771, 715.0501503958083, 3.7702014580733882], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 1, 1.8181818181818181, 1221.5636363636365, 969, 1742, 1265.0, 1415.8, 1534.1999999999998, 1742.0, 0.2552784623881996, 307.19280518685224, 1.2524690213784109], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=564a6980-85e6-48cc-9136-ae980adec559", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 0.7687832446808511, 2.9338430851063833], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 497.7692307692308, 356, 802, 444.0, 750.8, 802.0, 802.0, 0.07615878520879224, 0.013759155530885317, 0.05176417432160098], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 497.7692307692308, 356, 802, 444.0, 750.8, 802.0, 802.0, 0.07504127269998499, 0.013557261181149633, 0.05100461503827105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 176.0, 81, 256, 242.0, 253.0, 256.0, 256.0, 0.07356650411972424, 0.03546956448629561, 0.04107326304229023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 117.85714285714285, 81, 248, 84.0, 246.0, 248.0, 248.0, 0.0736299568738824, 0.05471913787209425, 0.03695878694646051], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 179.21428571428572, 80, 634, 83.5, 518.0, 634.0, 634.0, 0.07356727727506805, 3.1071706090845077, 0.04241818596231254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 196.28571428571428, 80, 716, 82.5, 642.0, 716.0, 716.0, 0.0736315058694829, 9.481833480377205, 0.04238331378592166], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/03e32c94-806e-4e4d-91aa-e1127f19f19c", 3, 0, 0.0, 478.3333333333333, 176, 815, 444.0, 815.0, 815.0, 815.0, 0.04403475810239549, 0.028310106527418975, 0.028238435371653357], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 209.85714285714286, 163, 366, 185.5, 316.0, 366.0, 366.0, 0.07611674133356532, 0.17360414978959157, 0.04920828394806664], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 104.66666666666666, 80, 245, 83.0, 243.8, 245.0, 245.0, 0.08316100525023147, 0.06180227050334585, 0.041742926463495096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 103.33333333333333, 80, 240, 83.0, 239.4, 240.0, 240.0, 0.08316377164337158, 0.030580011864698088, 0.04696370802308627], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 481.6666666666667, 395, 575, 477.0, 575.0, 575.0, 575.0, 0.10763104079216446, 31.647099679797652, 0.061383327951781294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 670.1666666666666, 560, 740, 716.5, 740.0, 740.0, 740.0, 0.10700527892709374, 96.2835380738158, 0.0609219507954059], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 161.5, 81, 242, 161.0, 242.0, 242.0, 242.0, 0.10792919844581954, 0.1909840894373291, 0.05976157765505828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 83.64285714285714, 80, 89, 83.5, 88.0, 89.0, 89.0, 0.07914836360758241, 0.0588202194388381, 0.03972876845146226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5997fca8-ce1f-47a2-8192-463833db1583", 1, 0, 0.0, 367.0, 367, 367, 367.0, 367.0, 367.0, 367.0, 2.7247956403269753, 0.49227264986376024, 1.8786188692098094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 93.0714285714286, 80, 242, 82.0, 162.5, 242.0, 242.0, 0.07914970601537766, 0.021178729929895976, 0.04514006671189507], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 93.64285714285714, 80, 243, 82.0, 164.0, 243.0, 243.0, 0.07914925854105302, 0.021333198591143198, 0.04653110707198625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 105.28571428571428, 80, 247, 82.0, 244.5, 247.0, 247.0, 0.07915104846870989, 0.02133368103258196, 0.04660945529944537], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=700ff5df-d384-4f03-8474-722042ccae92", 1, 0, 0.0, 339.0, 339, 339, 339.0, 339.0, 339.0, 339.0, 2.949852507374631, 0.5329323377581121, 2.033785029498525], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 134.83333333333334, 81, 244, 82.0, 244.0, 244.0, 244.0, 0.10792531568154837, 0.08020621604849444, 0.060602594254775696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 505.60000000000014, 79, 804, 722.0, 766.2, 804.0, 804.0, 0.07543526145861622, 45.25796462777728, 0.040025871151544413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 146.4, 81, 718, 82.0, 435.4000000000002, 718.0, 718.0, 0.08316284949187498, 5.009592531490999, 0.048414205739345455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 375.9333333333332, 81, 572, 402.0, 570.2, 572.0, 572.0, 0.0754341233800522, 14.79353523276456, 0.04009893342435718], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 103.8, 81, 399, 82.0, 213.0000000000001, 399.0, 399.0, 0.08316331056506698, 1.6511057428424112, 0.048495688328860996], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 393.3076923076923, 179, 738, 369.0, 658.4, 738.0, 738.0, 0.0750456046366638, 0.013558043806428522, 0.05174042663426236], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c56b1db3-102c-4288-a361-d1b4d65f0f3a", 3, 0, 0.0, 240.33333333333331, 163, 369, 189.0, 369.0, 369.0, 369.0, 0.04144734115306503, 0.034552942933919126, 0.02657918687224548], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 201.57142857142858, 164, 337, 167.5, 332.0, 337.0, 337.0, 0.07911079466793244, 0.12260628040821168, 0.17792203136743007], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=53a1f0b4-0c8d-4a02-90ce-ceed6e03fbe4", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fbaa0136-66a4-480f-89ad-41163b77f1c1", 1, 0, 0.0, 369.0, 369, 369, 369.0, 369.0, 369.0, 369.0, 2.710027100271003, 0.4896045054200542, 1.8684366531165313], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=65e70972-2be8-4ccb-a4f5-7b150b0c0e14", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 0.47418389107611547, 1.8095882545931758], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 423.27272727272725, 93, 1099, 346.0, 932.3999999999999, 1082.1999999999998, 1099.0, 0.09629104405752952, 0.05914752608611921, 0.043537845115855636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 94.26666666666667, 80, 246, 83.0, 151.20000000000005, 246.0, 246.0, 0.07543450273575797, 0.05606021150577325, 0.03786458438103476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 145.79999999999998, 79, 245, 83.0, 244.4, 245.0, 245.0, 0.07543526145861622, 0.09571831027528842, 0.03879808369290808], "isController": false}, {"data": ["login", 22, 0, 0.0, 1971.9545454545453, 1322, 3005, 1807.0, 2826.3999999999996, 2994.5, 3005.0, 0.09609042982996362, 31.483137016763415, 0.18843585800018345], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3e32d495-a1da-4c43-92eb-e0ec43d124da", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 5.58659217877095, 1.009296438547486, 3.85169343575419], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 87.53333333333332, 82, 95, 86.0, 94.4, 95.0, 95.0, 0.08461620908101156, 0.06850277082827987, 0.03007841807176583], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=03e32c94-806e-4e4d-91aa-e1127f19f19c", 1, 0, 0.0, 355.0, 355, 355, 355.0, 355.0, 355.0, 355.0, 2.8169014084507045, 0.5089128521126761, 1.9421214788732395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ce5559e1-2f88-45ae-8907-aac4b157480a", 3, 0, 0.0, 591.0, 347, 1060, 366.0, 1060.0, 1060.0, 1060.0, 0.024013447530617148, 0.0240837994276795, 0.015399248579204354], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3685b8ba-4a1e-4be9-a205-6c68d974032c", 1, 0, 0.0, 539.0, 539, 539, 539.0, 539.0, 539.0, 539.0, 1.8552875695732838, 0.3351837894248608, 1.2791338126159555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 612.2666666666667, 163, 892, 806.0, 852.4, 892.0, 892.0, 0.07540227111640603, 60.1771731484344, 0.15671988967391032], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f9668d18-ce8d-47b8-bb5d-e029776aa93a", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 0.45970499363867684, 1.754333651399491], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=578adaa0-a4cc-46dc-a45e-48267056a4c0", 1, 0, 0.0, 358.0, 358, 358, 358.0, 358.0, 358.0, 358.0, 2.793296089385475, 0.504648219273743, 1.925846717877095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 389.99999999999994, 163, 802, 330.5, 760.0, 802.0, 802.0, 0.0735332738063974, 12.665019007038186, 0.16269031658700564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 0, 0.0, 805.5, 641, 984, 799.5, 984.0, 984.0, 984.0, 0.10654165778819517, 127.46086258789686, 0.24023895296185807], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 803.5454545454546, 217, 1610, 847.0, 1407.9999999999998, 1592.2999999999997, 1610.0, 0.09911338571325597, 0.031184112124270167, 0.044717172069847905], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 119.82352941176471, 83, 255, 88.0, 247.0, 255.0, 255.0, 0.08989999947117648, 0.06979540974568876, 0.03195664043701976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 252.86666666666667, 164, 962, 168.0, 680.0000000000002, 962.0, 962.0, 0.08312275568559649, 6.749816697006473, 0.1855271766386266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 283.6111111111111, 165, 952, 170.0, 533.5000000000007, 952.0, 952.0, 0.1213608597742688, 8.24373532502798, 0.2712183450424089], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 102.22222222222223, 81, 242, 86.0, 242.0, 242.0, 242.0, 0.04785401335658684, 0.035563382973010337, 0.024020471548130504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 99.55555555555556, 81, 241, 82.0, 241.0, 241.0, 241.0, 0.047855285616296324, 0.020791293794232904, 0.026845901327718313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 171.11111111111111, 80, 727, 83.0, 727.0, 727.0, 727.0, 0.047855285616296324, 4.7959397864192015, 0.02767672225855679], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 137.88888888888889, 80, 588, 82.0, 588.0, 588.0, 588.0, 0.047855285616296324, 1.574914541759054, 0.027723455935916453], "isController": false}, {"data": ["https://demoqa.com/books", 55, 1, 1.8181818181818181, 789.2545454545455, 636, 1195, 657.0, 1064.8, 1093.3999999999994, 1195.0, 0.236971929597794, 282.24205487650534, 0.46576008073202785], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 803.5454545454546, 217, 1610, 847.0, 1407.9999999999998, 1592.2999999999997, 1610.0, 0.09668799662470995, 0.030421010301666548, 0.043622904727164055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 17, 0, 0.0, 144.41176470588235, 79, 669, 82.0, 328.9999999999997, 669.0, 669.0, 0.08390793818452837, 1.4725631067901264, 0.048986464600721605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 17, 0, 0.0, 100.88235294117646, 81, 242, 82.0, 242.0, 242.0, 242.0, 0.08397508409857686, 0.022633909385944548, 0.049368164675139915], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4373eb3c-bcec-4246-b04c-a7cbebacc5c3", 1, 0, 0.0, 285.0, 285, 285, 285.0, 285.0, 285.0, 285.0, 3.5087719298245617, 1.1204769736842106, 2.0936129385964914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 148.23529411764707, 80, 712, 83.0, 340.79999999999967, 712.0, 712.0, 0.08686010923936091, 4.61949783520338, 0.050625153282545715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 110.23529411764706, 80, 562, 82.0, 180.39999999999966, 562.0, 562.0, 0.0868592216391868, 1.5243573854607881, 0.05070945941630603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 111.82352941176471, 81, 393, 84.0, 272.1999999999999, 393.0, 393.0, 0.08685744649325833, 0.06454933279430623, 0.04359836669681131], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 17, 0, 0.0, 81.23529411764706, 80, 83, 81.0, 83.0, 83.0, 83.0, 0.08397508409857686, 0.022469895549814514, 0.04789204014996962], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 121.82352941176471, 81, 248, 83.0, 244.8, 248.0, 248.0, 0.08685877784590232, 0.030915497905170654, 0.04910754202432046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 17, 0, 0.0, 94.3529411764706, 81, 244, 83.0, 135.1999999999999, 244.0, 244.0, 0.08397342488083183, 0.06240603157647756, 0.042150723035886295], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 17, 0, 0.0, 105.94117647058823, 83, 406, 86.0, 165.99999999999977, 406.0, 406.0, 0.08162794940987794, 0.06425012424254065, 0.02901618514179255], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 582.6666666666666, 350, 1060, 496.0, 1042.6000000000001, 1060.0, 1060.0, 0.08760722759627669, 0.01582747764190546, 0.059631091440043804], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/564a6980-85e6-48cc-9136-ae980adec559", 3, 0, 0.0, 292.0, 189, 495, 192.0, 495.0, 495.0, 495.0, 0.09981700216270172, 0.04516459407752454, 0.06401025203793047], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1106.7727272727273, 618, 1823, 1127.0, 1567.8, 1788.9499999999996, 1823.0, 0.09576542693968519, 0.04956609011526675, 0.04404835555526536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 17, 0, 0.0, 240.23529411764707, 162, 777, 167.0, 544.9999999999998, 777.0, 777.0, 0.08387233643660978, 1.5793178295936139, 0.18820686340896645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/700ff5df-d384-4f03-8474-722042ccae92", 3, 0, 0.0, 413.33333333333337, 213, 762, 265.0, 762.0, 762.0, 762.0, 0.02356711915535445, 0.02785553699644922, 0.015113028885432377], "isController": false}, {"data": ["addBook", 64, 6, 9.375, 844.1406249999999, 421, 1945, 721.0, 1310.5, 1449.5, 1945.0, 0.29335325690869835, 88.85622077210348, 1.067863866900127], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 155.25454545454548, 81, 380, 84.0, 330.8, 335.0, 380.0, 0.23755123548238016, 0.1765395412129798, 0.11483189605837714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5997fca8-ce1f-47a2-8192-463833db1583", 3, 0, 0.0, 568.0, 182, 784, 738.0, 784.0, 784.0, 784.0, 0.018981455118349373, 0.026167468237698433, 0.012172352403368576], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 1, 1.8181818181818181, 434.03636363636366, 0, 656, 406.0, 566.0, 588.9999999999998, 656.0, 0.23734621044409632, 68.52692069049407, 0.11719811989435935], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 140.61818181818182, 80, 338, 85.0, 250.4, 271.99999999999966, 338.0, 0.237844008925637, 0.4208724064191936, 0.1156702309032883], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 631.9636363636364, 549, 829, 567.0, 731.4, 801.8, 829.0, 0.23735235604579608, 213.57006719094565, 0.11913975684329997], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 104.66666666666666, 83, 248, 87.0, 241.70000000000002, 248.0, 248.0, 0.11773786318860298, 0.08795846224539187, 0.04185213105532371], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 6, 3.278688524590164, 154.1420765027322, 82, 1592, 89.0, 248.6, 346.19999999999976, 1110.679999999998, 0.7366200811489664, 1.5087126457139177, 0.35809755033570556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 123.66666666666667, 84, 254, 88.0, 254.0, 254.0, 254.0, 0.047801401112179266, 0.03701807722847476, 0.016991904301594973], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c56b1db3-102c-4288-a361-d1b4d65f0f3a", 1, 0, 0.0, 738.0, 738, 738, 738.0, 738.0, 738.0, 738.0, 1.3550135501355014, 0.2448022527100271, 0.9342183265582656], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 87.71428571428572, 83, 104, 85.0, 99.0, 104.0, 104.0, 0.07093132834111888, 0.05756243540182598, 0.025213870621257108], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19d41ac5-0625-484d-a101-6bd060900ab2", 2, 0, 0.0, 199.0, 182, 216, 199.0, 216.0, 216.0, 216.0, 0.0364232380258605, 0.03139014409943544, 0.02264003027681661], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3685b8ba-4a1e-4be9-a205-6c68d974032c", 3, 0, 0.0, 472.0, 169, 1002, 245.0, 1002.0, 1002.0, 1002.0, 0.019255579304103362, 0.02654537055757739, 0.012348141676133993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 274.77777777777777, 165, 809, 170.0, 809.0, 809.0, 809.0, 0.04783264950360339, 6.424169804577053, 0.10621692405503944], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a9c6e0b-fa31-4189-910e-27564fb4551a", 1, 0, 0.0, 170.0, 170, 170, 170.0, 170.0, 170.0, 170.0, 5.88235294117647, 1.8784466911764706, 3.5098805147058822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 270.8235294117647, 164, 1105, 170.0, 612.9999999999995, 1105.0, 1105.0, 0.08682018518234794, 6.236470255149204, 0.19395393965741778], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ce5559e1-2f88-45ae-8907-aac4b157480a", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fbaa0136-66a4-480f-89ad-41163b77f1c1", 3, 0, 0.0, 293.6666666666667, 179, 352, 350.0, 352.0, 352.0, 352.0, 0.03381996505270278, 0.027489730708528268, 0.021687933318302238], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/65e70972-2be8-4ccb-a4f5-7b150b0c0e14", 3, 0, 0.0, 301.0, 189, 501, 213.0, 501.0, 501.0, 501.0, 0.044047042241113506, 0.028318004044986713, 0.028246312895505735], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 87.64285714285714, 83, 96, 87.5, 94.5, 96.0, 96.0, 0.0842612097502257, 0.06986110066205237, 0.02995222690340054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e32d495-a1da-4c43-92eb-e0ec43d124da", 3, 0, 0.0, 315.6666666666667, 202, 497, 248.0, 497.0, 497.0, 497.0, 0.07016066792955869, 0.031745875137397975, 0.04499235541055684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 97.73333333333335, 84, 246, 86.0, 158.40000000000003, 246.0, 246.0, 0.07490150452155415, 0.05815107040491753, 0.026625144185396202], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f9668d18-ce8d-47b8-bb5d-e029776aa93a", 2, 0, 0.0, 211.5, 157, 266, 211.5, 266.0, 266.0, 266.0, 0.015383432043688946, 0.030406314898853936, 0.009562064937312514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/578adaa0-a4cc-46dc-a45e-48267056a4c0", 3, 0, 0.0, 275.6666666666667, 165, 360, 302.0, 360.0, 360.0, 360.0, 0.028313372405787254, 0.028396321739007333, 0.018156687382617477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 110.16666666666666, 80, 242, 84.0, 242.0, 242.0, 242.0, 0.12194461004823587, 0.09062485180342529, 0.06121047809061839], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 110.16666666666666, 80, 248, 82.0, 244.4, 248.0, 248.0, 0.12194791469065878, 0.04280615278041245, 0.06897943568602476], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/53a1f0b4-0c8d-4a02-90ce-ceed6e03fbe4", 3, 0, 0.0, 273.3333333333333, 199, 414, 207.0, 414.0, 414.0, 414.0, 0.019178397453108818, 0.022668216520910847, 0.012298646804239706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 152.61111111111111, 80, 710, 83.0, 290.60000000000065, 710.0, 710.0, 0.12143045070935621, 6.101096173338595, 0.07080807748611982], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 153.77777777777777, 81, 566, 84.0, 276.20000000000044, 566.0, 566.0, 0.12154852824990378, 2.0164579028489626, 0.07099563016159202], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 42.857142857142854, 0.4491017964071856], "isController": false}, {"data": ["Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, 7.142857142857143, 0.0748502994011976], "isController": false}, {"data": ["401/Unauthorized", 6, 42.857142857142854, 0.4491017964071856], "isController": false}, {"data": ["Assertion failed", 1, 7.142857142857143, 0.0748502994011976], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1336, 14, "406/Not Acceptable", 6, "401/Unauthorized", 6, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, "Assertion failed", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books", 55, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 1, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
