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

    var data = {"OkPercent": 98.426435877262, "KoPercent": 1.5735641227380015};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8057239057239057, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.37962962962962965, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=36445659-12b1-46b1-a091-9aca61a2a897"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4d7313c2-0f84-4337-bb5d-9fbfa77ed924"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/108cd69e-fd4c-4e0a-adec-0acbc2a25851"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bffd3740-cd64-41de-9c26-9950f2df5581"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be87fd7f-fc07-48cf-a48e-f123dacee880"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8055555555555556, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7045454545454546, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=544bac37-4116-48d9-a026-a1a411fbf4cc"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bffd3740-cd64-41de-9c26-9950f2df5581"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/eab57bc9-42af-426d-8419-b9a1bb198667"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "register"], "isController": true}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a4802940-e353-4947-a5e5-631cd6ecaab7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=23794e87-53b1-48de-9ed3-46a9a2501b59"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9b4c3e70-e7c9-496d-915a-5365194c9fc8"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/36445659-12b1-46b1-a091-9aca61a2a897"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/15602f19-2e79-4860-a886-e90690756f2d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4d7313c2-0f84-4337-bb5d-9fbfa77ed924"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.18181818181818182, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3684210526315789, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fbc65303-02d3-4fa7-87c6-f2893cdca0d9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=108cd69e-fd4c-4e0a-adec-0acbc2a25851"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=acca9aa8-1869-4954-b5fc-96805ff6f09e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9345238095238095, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da72b664-6e5f-4b6f-929a-ba6985637b39"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/be87fd7f-fc07-48cf-a48e-f123dacee880"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/acca9aa8-1869-4954-b5fc-96805ff6f09e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fbc65303-02d3-4fa7-87c6-f2893cdca0d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/da72b664-6e5f-4b6f-929a-ba6985637b39"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/79919558-d1a0-42c2-b8e5-e5573dac7554"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/544bac37-4116-48d9-a026-a1a411fbf4cc"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eab57bc9-42af-426d-8419-b9a1bb198667"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9b4c3e70-e7c9-496d-915a-5365194c9fc8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=15602f19-2e79-4860-a886-e90690756f2d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/23794e87-53b1-48de-9ed3-46a9a2501b59"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bfa0696c-a60b-4bd1-82a2-799c8b558a97"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/82d961fd-ac2a-4a0d-bdca-ed7ce6cb22aa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1271, 20, 1.5735641227380015, 318.73642800944117, 76, 2811, 107.0, 852.3999999999999, 1076.9999999999993, 1683.3599999999997, 4.925974730641035, 707.9633255779592, 3.588899358576855], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1360.9259259259259, 1002, 1834, 1375.0, 1612.5, 1703.5, 1834.0, 0.25361399949277197, 305.1821702166756, 1.247018054146589], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=36445659-12b1-46b1-a091-9aca61a2a897", 1, 0, 0.0, 198.0, 198, 198, 198.0, 198.0, 198.0, 198.0, 5.050505050505051, 0.91244476010101, 3.4820864898989896], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 527.8666666666668, 89, 830, 541.0, 825.8, 830.0, 830.0, 0.09127252149467881, 0.017880144347492744, 0.06145445425116981], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 527.8666666666668, 89, 830, 541.0, 825.8, 830.0, 830.0, 0.09290571927607863, 0.018200085240997435, 0.06255409822612013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 91.5, 79, 248, 81.0, 133.90000000000012, 248.0, 248.0, 0.09272835807055468, 0.024812080186847642, 0.052884141712113225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 82.8125, 79, 88, 82.5, 87.3, 88.0, 88.0, 0.0928171154760938, 0.06897834460674548, 0.04658984116671114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 130.5, 78, 248, 82.0, 248.0, 248.0, 248.0, 0.09281819236570368, 0.02501740341106857, 0.0546575878872259], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 100.93749999999999, 78, 242, 81.0, 240.6, 242.0, 242.0, 0.09273212008809552, 0.024994204242494496, 0.05451634403616553], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4d7313c2-0f84-4337-bb5d-9fbfa77ed924", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 217.93333333333334, 82, 465, 190.0, 460.8, 465.0, 465.0, 0.09106583452730761, 0.16904095534131475, 0.058860781587702464], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/108cd69e-fd4c-4e0a-adec-0acbc2a25851", 3, 0, 0.0, 281.6666666666667, 183, 465, 197.0, 465.0, 465.0, 465.0, 0.030950170225936244, 0.02580188344681729, 0.019847602651397914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 114.0625, 79, 252, 84.5, 248.5, 252.0, 252.0, 0.09870328558561893, 0.07335273469790625, 0.049544422647468875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 102.875, 79, 250, 82.0, 238.10000000000002, 250.0, 250.0, 0.0987057212303668, 0.03567720221717726, 0.055774997995040036], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 503.0, 393, 621, 481.0, 621.0, 621.0, 621.0, 0.051897367765506935, 15.259549277848128, 0.029597717553765675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 933.4, 724, 1118, 973.0, 1118.0, 1118.0, 1118.0, 0.05162675918181912, 46.45384866196347, 0.02939296933886772], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 209.0, 78, 252, 238.0, 252.0, 252.0, 252.0, 0.05202155773352477, 0.09205377208315126, 0.028804905502840376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 96.9090909090909, 79, 236, 83.0, 206.4000000000001, 236.0, 236.0, 0.07040135170595276, 0.05231975453928715, 0.03533817849302706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 125.9090909090909, 79, 261, 81.0, 256.6, 261.0, 261.0, 0.07047216349541931, 0.03810151595233519, 0.039115053815106667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 258.8181818181818, 78, 960, 83.0, 938.6000000000001, 960.0, 960.0, 0.0700770847932726, 11.480087257915525, 0.04010270672740014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 164.54545454545456, 79, 616, 81.0, 585.8000000000001, 616.0, 616.0, 0.07023099613091058, 3.770077685058675, 0.04025936985238721], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bffd3740-cd64-41de-9c26-9950f2df5581", 3, 0, 0.0, 314.0, 171, 513, 258.0, 513.0, 513.0, 513.0, 0.04253388532864515, 0.035458750106334716, 0.02727596162025747], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be87fd7f-fc07-48cf-a48e-f123dacee880", 1, 0, 0.0, 298.0, 298, 298, 298.0, 298.0, 298.0, 298.0, 3.3557046979865772, 0.6062552432885906, 2.3136010906040267], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 116.2, 82, 239, 87.0, 239.0, 239.0, 239.0, 0.05202101649066222, 0.038660149950580036, 0.029211020002080843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 539.4444444444445, 78, 1009, 747.0, 1000.9, 1009.0, 1009.0, 0.08914553999910854, 44.57363088855817, 0.048151746757330985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 163.0, 79, 716, 83.0, 392.60000000000036, 716.0, 716.0, 0.09860656596471117, 5.5703140407275935, 0.05744025058393576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 370.38888888888886, 79, 732, 461.0, 711.3000000000001, 732.0, 732.0, 0.08914686450667116, 14.572978006725636, 0.048239519671741435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 156.75, 79, 637, 82.0, 366.8000000000003, 637.0, 637.0, 0.09860717367188462, 1.8370280529705412, 0.05753690065327253], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 567.1428571428572, 99, 2033, 472.0, 1482.5, 2033.0, 2033.0, 0.09251305094825876, 0.01746880782065684, 0.06331232860305293], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 357.90909090909093, 160, 1041, 166.0, 1021.0000000000001, 1041.0, 1041.0, 0.06997143893083642, 15.308755683191588, 0.15411234272328841], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 637.0, 142, 1456, 654.5, 1347.6, 1442.35, 1456.0, 0.09520018001488585, 0.058477454325549995, 0.04304461264344936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 81.38888888888889, 79, 86, 80.5, 86.0, 86.0, 86.0, 0.08914465701593213, 0.06624910545812925, 0.0447464391662003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 133.33333333333337, 78, 245, 81.0, 244.1, 245.0, 245.0, 0.08914686450667116, 0.09823953514862764, 0.04668215799795953], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=544bac37-4116-48d9-a026-a1a411fbf4cc", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["login", 22, 0, 0.0, 2862.409090909092, 1666, 4991, 2669.5, 4322.299999999999, 4909.999999999999, 4991.0, 0.09588479877267457, 26.202994145851672, 0.18080549768568963], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bffd3740-cd64-41de-9c26-9950f2df5581", 1, 0, 0.0, 2033.0, 2033, 2033, 2033.0, 2033.0, 2033.0, 2033.0, 0.49188391539596654, 0.08886574643384161, 0.33913090260698475], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 88.3125, 82, 97, 87.5, 97.0, 97.0, 97.0, 0.09656237929702588, 0.07817403558323677, 0.03432490826573967], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eab57bc9-42af-426d-8419-b9a1bb198667", 3, 0, 0.0, 631.3333333333334, 341, 1095, 458.0, 1095.0, 1095.0, 1095.0, 0.02332089552238806, 0.02338921845848881, 0.014955131568718907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 622.4999999999999, 161, 1091, 830.5, 1081.1, 1091.0, 1091.0, 0.08910802863337987, 59.28592291165434, 0.1877398645805487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 236.00000000000006, 162, 334, 170.5, 333.3, 334.0, 334.0, 0.0926837745467184, 0.1436417482476974, 0.20844798123153566], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, 37.5, 687.5, 81, 1202, 916.0, 1202.0, 1202.0, 1202.0, 0.08239862394298014, 61.61914342124236, 0.13642242877668942], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1132.2608695652173, 205, 2136, 1142.0, 1578.8, 2027.1999999999985, 2136.0, 0.09701816770644833, 0.030565336463223788, 0.04377186863318275], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 299.24999999999994, 164, 799, 175.5, 587.6000000000003, 799.0, 799.0, 0.09855615236781157, 7.512410231129577, 0.22007906436332728], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 86.99999999999999, 81, 97, 85.0, 97.0, 97.0, 97.0, 0.09798327367881082, 0.07607099860806114, 0.034829991815514785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 342.8666666666667, 163, 948, 321.0, 934.2, 948.0, 948.0, 0.10819466383917946, 17.403780851257583, 0.2396413189109846], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a4802940-e353-4947-a5e5-631cd6ecaab7", 1, 0, 0.0, 171.0, 171, 171, 171.0, 171.0, 171.0, 171.0, 5.847953216374268, 1.8674616228070173, 3.4893548976608186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 81.5, 80, 88, 81.0, 86.5, 88.0, 88.0, 0.06981696319482424, 0.051885457999278566, 0.03504484285365201], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 119.91666666666666, 78, 246, 82.0, 243.3, 246.0, 246.0, 0.06981615080288574, 0.02741965688270887, 0.039328401355596926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 169.99999999999997, 79, 690, 80.5, 556.5000000000005, 690.0, 690.0, 0.06981696319482424, 5.2523685495671355, 0.04054474685532762], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=23794e87-53b1-48de-9ed3-46a9a2501b59", 1, 0, 0.0, 781.0, 781, 781, 781.0, 781.0, 781.0, 781.0, 1.2804097311139564, 0.23132402368758, 0.882782490396927], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 164.83333333333334, 78, 622, 81.0, 508.3000000000004, 622.0, 622.0, 0.06981736939788337, 1.7279685290934796, 0.04061316377409426], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9b4c3e70-e7c9-496d-915a-5365194c9fc8", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 0.36205222945891785, 1.3816695891783568], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 99.0, 99, 99, 99.0, 99.0, 99.0, 99.0, 10.101010101010102, 2.9790088383838382, 6.2440814393939394], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 919.7222222222223, 620, 1483, 848.0, 1281.0, 1372.5, 1483.0, 0.24131274131274133, 288.6939324927606, 0.4764984013030888], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1132.2608695652173, 205, 2136, 1142.0, 1578.8, 2027.1999999999985, 2136.0, 0.09442754328271195, 0.029749166574291896, 0.04260305175450481], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/36445659-12b1-46b1-a091-9aca61a2a897", 3, 0, 0.0, 329.0, 190, 547, 250.0, 547.0, 547.0, 547.0, 0.0762970498474059, 0.03536686164801628, 0.04892747011698881], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 81.5, 79, 86, 81.0, 86.0, 86.0, 86.0, 0.03256409699759026, 0.00877704176888175, 0.01917592821244817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 106.33333333333333, 78, 238, 80.5, 238.0, 238.0, 238.0, 0.03256427373528502, 0.00877708940521354, 0.019144231238907794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 165.2941176470588, 79, 714, 82.0, 352.3999999999997, 714.0, 714.0, 0.09722841815082987, 5.170917594983585, 0.05666817156240349], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 154.94117647058823, 79, 621, 81.0, 384.9999999999998, 621.0, 621.0, 0.09722674993851839, 1.706304886645048, 0.05676214726707045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/15602f19-2e79-4860-a886-e90690756f2d", 3, 0, 0.0, 296.0, 199, 488, 201.0, 488.0, 488.0, 488.0, 0.08156163340764505, 0.036904515116089394, 0.05230352142352238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 112.17647058823528, 79, 252, 84.0, 248.8, 252.0, 252.0, 0.09722563782877994, 0.07225459998798978, 0.0488027127382743], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 79.0, 76, 82, 78.5, 82.0, 82.0, 82.0, 0.03256427373528502, 0.008713487308074312, 0.018571812364654737], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4d7313c2-0f84-4337-bb5d-9fbfa77ed924", 3, 0, 0.0, 411.0, 292, 476, 465.0, 476.0, 476.0, 476.0, 0.020919626793857997, 0.024726290653808068, 0.013415255463509197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 135.0588235294118, 78, 241, 81.0, 239.4, 241.0, 241.0, 0.09722786207369871, 0.03460614851841896, 0.05496993442838596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 81.0, 79, 83, 80.5, 83.0, 83.0, 83.0, 0.032563920261813914, 0.024200335272695696, 0.016345561537668318], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 91.66666666666666, 82, 102, 91.5, 102.0, 102.0, 102.0, 0.03426202454303025, 0.026967960724299196, 0.012179079036780283], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 575.4285714285714, 81, 1095, 497.5, 1047.5, 1095.0, 1095.0, 0.09190271441231497, 0.01717406333081695, 0.06254846432205337], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1657.909090909091, 1270, 2811, 1539.5, 2166.7999999999997, 2723.0999999999985, 2811.0, 0.09694277732244048, 0.05017546091884127, 0.04458989074108347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 190.0, 160, 319, 165.0, 319.0, 319.0, 319.0, 0.03254978761263583, 0.05044581341919244, 0.07320523522646515], "isController": false}, {"data": ["addBook", 57, 8, 14.035087719298245, 935.6666666666666, 419, 3346, 727.0, 1562.0, 1707.5999999999976, 3346.0, 0.2588838020492697, 93.40364178827393, 0.9380191159572343], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 140.87037037037032, 78, 423, 84.0, 330.5, 340.5, 423.0, 0.2419788492561391, 0.17982998465226743, 0.11697219763846568], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fbc65303-02d3-4fa7-87c6-f2893cdca0d9", 1, 0, 0.0, 932.0, 932, 932, 932.0, 932.0, 932.0, 932.0, 1.0729613733905579, 0.1938455606223176, 0.7397565718884119], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=108cd69e-fd4c-4e0a-adec-0acbc2a25851", 1, 0, 0.0, 507.0, 507, 507, 507.0, 507.0, 507.0, 507.0, 1.9723865877712032, 0.3563393737672584, 1.3598680966469427], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 499.49999999999994, 386, 760, 468.0, 636.0, 711.0, 760.0, 0.24172105390379503, 71.07401574208363, 0.12156869410200628], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 125.44444444444441, 78, 340, 85.5, 246.5, 256.25, 340.0, 0.2423002369157872, 0.42875784110488907, 0.11783741990631057], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=acca9aa8-1869-4954-b5fc-96805ff6f09e", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 773.5185185185185, 534, 1105, 746.5, 987.0, 1020.75, 1105.0, 0.24179790173154164, 217.5701770134153, 0.12137121239259024], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 107.39999999999999, 80, 251, 94.0, 180.80000000000004, 251.0, 251.0, 0.11366477983132146, 0.08491558258882902, 0.04040427720566505], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 8, 4.761904761904762, 164.13095238095244, 80, 2208, 91.0, 284.4, 387.9999999999993, 1377.9300000000028, 0.687825488847401, 1.5206711966423472, 0.3302747425260391], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 100.41666666666666, 79, 234, 87.0, 195.60000000000014, 234.0, 234.0, 0.06520038250891072, 0.050492093095279494, 0.023176698469964358], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da72b664-6e5f-4b6f-929a-ba6985637b39", 1, 0, 0.0, 567.0, 567, 567, 567.0, 567.0, 567.0, 567.0, 1.763668430335097, 0.3186315035273369, 1.2159667107583776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be87fd7f-fc07-48cf-a48e-f123dacee880", 3, 0, 0.0, 318.3333333333333, 185, 448, 322.0, 448.0, 448.0, 448.0, 0.05933192255206376, 0.026807522298914224, 0.03804814043866068], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/acca9aa8-1869-4954-b5fc-96805ff6f09e", 3, 0, 0.0, 613.0, 222, 1110, 507.0, 1110.0, 1110.0, 1110.0, 0.026420311935816256, 0.026497715193440716, 0.016942713057798833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fbc65303-02d3-4fa7-87c6-f2893cdca0d9", 3, 0, 0.0, 348.6666666666667, 247, 424, 375.0, 424.0, 424.0, 424.0, 0.03633192849876471, 0.029744401098435305, 0.023298795293804193], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 97.4375, 81, 241, 86.0, 145.10000000000008, 241.0, 241.0, 0.0959502977457677, 0.07786591545579391, 0.03410733240181586], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da72b664-6e5f-4b6f-929a-ba6985637b39", 3, 0, 0.0, 272.0, 174, 437, 205.0, 437.0, 437.0, 437.0, 0.035242290748898675, 0.02938004772393539, 0.02260003671071953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 279.9166666666667, 161, 770, 239.5, 637.1000000000005, 770.0, 770.0, 0.06978367062107467, 7.056266037523261, 0.15545721025238426], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/79919558-d1a0-42c2-b8e5-e5573dac7554", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.6557206108829569, 1.2252149640657084], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/544bac37-4116-48d9-a026-a1a411fbf4cc", 3, 0, 0.0, 999.6666666666666, 224, 1997, 778.0, 1997.0, 1997.0, 1997.0, 0.017737729925324155, 0.02445289265421478, 0.011374781234664254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 311.88235294117646, 161, 800, 315.0, 623.1999999999998, 800.0, 800.0, 0.09717950770004688, 6.980601433969383, 0.21709638527959116], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eab57bc9-42af-426d-8419-b9a1bb198667", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 114.63636363636364, 80, 247, 86.0, 246.6, 247.0, 247.0, 0.07309844366768119, 0.060606033861192704, 0.025984212397496046], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b4c3e70-e7c9-496d-915a-5365194c9fc8", 3, 0, 0.0, 497.33333333333337, 199, 1000, 293.0, 1000.0, 1000.0, 1000.0, 0.019683102056884165, 0.023264760276219532, 0.012622301774759703], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=15602f19-2e79-4860-a886-e90690756f2d", 1, 0, 0.0, 182.0, 182, 182, 182.0, 182.0, 182.0, 182.0, 5.4945054945054945, 0.9926596840659341, 3.7882039835164836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/23794e87-53b1-48de-9ed3-46a9a2501b59", 3, 0, 0.0, 408.33333333333337, 184, 797, 244.0, 797.0, 797.0, 797.0, 0.0345240287239919, 0.028781262227260174, 0.022139432482507826], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 103.11111111111111, 83, 354, 85.5, 138.90000000000035, 354.0, 354.0, 0.08553263069861153, 0.06640472793495719, 0.030404177318647065], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bfa0696c-a60b-4bd1-82a2-799c8b558a97", 1, 0, 0.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 180.0, 5.555555555555555, 1.7740885416666667, 3.3148871527777777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/82d961fd-ac2a-4a0d-bdca-ed7ce6cb22aa", 1, 0, 0.0, 311.0, 311, 311, 311.0, 311.0, 311.0, 311.0, 3.215434083601286, 1.02680365755627, 1.9185842041800643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 83.46666666666667, 78, 91, 84.0, 88.6, 91.0, 91.0, 0.10838776807907971, 0.08054989405095671, 0.054405578899069315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 111.86666666666666, 78, 241, 82.0, 235.6, 241.0, 241.0, 0.10838855127862361, 0.050708341763553995, 0.06060161968625128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 225.8, 78, 862, 83.0, 852.4, 862.0, 862.0, 0.10825791365348808, 13.01337650568715, 0.06240335725833225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 216.4, 79, 628, 236.0, 619.6, 628.0, 628.0, 0.10826338315854812, 4.2696935604939705, 0.06251223601778406], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 30.0, 0.47206923682140045], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 10.0, 0.15735641227380015], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.0, 0.07867820613690008], "isController": false}, {"data": ["401/Unauthorized", 11, 55.0, 0.8654602675059009], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1271, 20, "401/Unauthorized", 11, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
