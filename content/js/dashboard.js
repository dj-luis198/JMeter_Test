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

    var data = {"OkPercent": 98.80239520958084, "KoPercent": 1.1976047904191616};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7864516129032258, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/968e166b-7f72-402c-a234-482c390375ea"], "isController": false}, {"data": [0.1724137931034483, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e1727328-027a-4477-aa8d-7a3bff2f767f"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ef906b28-2e00-4a10-a40e-3f90643b3315"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fb3eabe8-fa03-4377-b6e5-0c29007fd8e0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/66f1d674-be62-4f08-bef6-3e793576705a"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=edd43436-d977-4da1-a241-0814e58b2e4b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3bbd55ac-7f2a-4739-bb50-d3456a2a51f8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d1a3a40d-635d-4c29-b894-f5711d1fa8c6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d1a3a40d-635d-4c29-b894-f5711d1fa8c6"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6136363636363636, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8661d409-ad7b-44dc-aa3e-1376f3579bf1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/edd43436-d977-4da1-a241-0814e58b2e4b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=89ca1798-3c61-47e6-a642-80d09fefec52"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b0c0ce7c-48b0-44c0-a117-501b209bb0da"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=66f1d674-be62-4f08-bef6-3e793576705a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8a926f00-9cbe-4705-a15c-d682d5d8228a"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ef906b28-2e00-4a10-a40e-3f90643b3315"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f944ba7a-1b95-49a0-b932-767352e0c783"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ed7e1b26-29ee-4ddc-97d6-125f055e53ae"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b1d32289-4d22-4dff-bb89-66f1e23feec3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2dc255c0-09c6-41e5-9de8-30cffa52fdd4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3bbd55ac-7f2a-4739-bb50-d3456a2a51f8"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.46551724137931033, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=968e166b-7f72-402c-a234-482c390375ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.1590909090909091, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.6379310344827587, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9241573033707865, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8661d409-ad7b-44dc-aa3e-1376f3579bf1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/89ca1798-3c61-47e6-a642-80d09fefec52"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b1d32289-4d22-4dff-bb89-66f1e23feec3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b0c0ce7c-48b0-44c0-a117-501b209bb0da"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ed7e1b26-29ee-4ddc-97d6-125f055e53ae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8a926f00-9cbe-4705-a15c-d682d5d8228a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bf908eb8-ed68-4164-ac8a-0d73d816a8c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2dc255c0-09c6-41e5-9de8-30cffa52fdd4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1336, 16, 1.1976047904191616, 365.073353293413, 91, 2429, 114.0, 1010.8999999999999, 1235.0, 1792.8899999999996, 5.339301414755015, 768.4669287901646, 3.900676779434098], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/968e166b-7f72-402c-a234-482c390375ea", 3, 0, 0.0, 295.0, 213, 448, 224.0, 448.0, 448.0, 448.0, 0.02432557347539468, 0.02439683980393588, 0.015599407469572762], "isController": false}, {"data": ["see books", 58, 0, 0.0, 1621.155172413793, 1165, 2079, 1630.5, 1905.1000000000001, 1959.6999999999998, 2079.0, 0.25131942699170645, 302.4212666742857, 1.2357356590851973], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e1727328-027a-4477-aa8d-7a3bff2f767f", 1, 0, 0.0, 541.0, 541, 541, 541.0, 541.0, 541.0, 541.0, 1.8484288354898337, 0.5902697550831792, 1.1029199399260627], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 681.8461538461538, 417, 1572, 554.0, 1377.6, 1572.0, 1572.0, 0.07478097802014486, 0.013510235286842575, 0.0508276959980672], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 681.8461538461538, 417, 1572, 554.0, 1377.6, 1572.0, 1572.0, 0.07410658807567994, 0.013388397259766394, 0.0503693215826887], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ef906b28-2e00-4a10-a40e-3f90643b3315", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb3eabe8-fa03-4377-b6e5-0c29007fd8e0", 1, 0, 0.0, 350.0, 350, 350, 350.0, 350.0, 350.0, 350.0, 2.857142857142857, 0.9123883928571429, 1.7047991071428572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 155.28571428571428, 93, 306, 100.0, 304.0, 305.9, 306.0, 0.14604123926423032, 0.07041274035953962, 0.08153697538161968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 143.14285714285714, 93, 406, 101.0, 306.2, 396.39999999999986, 406.0, 0.14603920805023748, 0.1085310911388972, 0.07330483685334187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 229.90476190476193, 93, 802, 99.0, 704.4000000000001, 794.8, 802.0, 0.14603920805023748, 6.168078415231194, 0.08420480564615396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 247.1904761904762, 91, 1156, 98.0, 1066.4, 1148.0, 1156.0, 0.14603920805023748, 18.806072699273976, 0.0840621892320424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/66f1d674-be62-4f08-bef6-3e793576705a", 3, 0, 0.0, 427.33333333333337, 211, 835, 236.0, 835.0, 835.0, 835.0, 0.07821869948375658, 0.03625762632319967, 0.05015977798925796], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 273.76923076923083, 191, 489, 243.0, 438.59999999999997, 489.0, 489.0, 0.07469203897775326, 0.1375900074979316, 0.04828723613600846], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=edd43436-d977-4da1-a241-0814e58b2e4b", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 0.8287342316513762, 3.162629013761468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 111.24999999999999, 93, 293, 99.0, 160.70000000000013, 293.0, 293.0, 0.10308082825445503, 0.07660596709144558, 0.051741743869911996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 131.81249999999997, 95, 303, 96.5, 284.8, 303.0, 303.0, 0.10296871681672212, 0.037218062804481714, 0.05818386110163656], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 788.2, 702, 892, 767.0, 892.0, 892.0, 892.0, 0.09553470775932897, 28.090376132086284, 0.054484638018992296], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1041.6, 873, 1180, 1051.0, 1180.0, 1180.0, 1180.0, 0.0947867298578199, 85.28926614336493, 0.05396549170616114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 134.4, 92, 286, 100.0, 286.0, 286.0, 286.0, 0.09676607768380717, 0.1712305984014244, 0.05358043559249869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 117.45454545454545, 93, 301, 99.0, 261.40000000000015, 301.0, 301.0, 0.0662187868718245, 0.04921142266548677, 0.033238727004021286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 133.72727272727272, 92, 302, 100.0, 299.6, 302.0, 302.0, 0.06621798962183507, 0.01771848550428009, 0.03776494720620282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 150.0, 93, 301, 96.0, 298.40000000000003, 301.0, 301.0, 0.0662195841410116, 0.017848247288007033, 0.038929872707899396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 132.9090909090909, 94, 287, 100.0, 286.6, 287.0, 287.0, 0.0662195841410116, 0.017848247288007033, 0.0389945402705371], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3bbd55ac-7f2a-4739-bb50-d3456a2a51f8", 1, 0, 0.0, 610.0, 610, 610, 610.0, 610.0, 610.0, 610.0, 1.639344262295082, 0.2961705942622951, 1.130251024590164], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 140.0, 96, 303, 102.0, 303.0, 303.0, 303.0, 0.0967623323592592, 0.07191028801308226, 0.0543343174868887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 822.7142857142857, 94, 1335, 968.0, 1310.0, 1335.0, 1335.0, 0.13156040031950383, 84.56604522976083, 0.06926743175304233], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 221.4375, 92, 1101, 102.5, 543.1000000000006, 1101.0, 1101.0, 0.10308547718911674, 5.8233290589101285, 0.06004930385088685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 593.2142857142858, 92, 899, 784.0, 884.0, 899.0, 899.0, 0.1315554553228277, 27.63989659976132, 0.06939330030351723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 141.625, 92, 596, 100.0, 379.7000000000002, 596.0, 596.0, 0.10295944041544135, 1.918109741089182, 0.060076431297095896], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 468.1538461538462, 218, 866, 476.0, 763.5999999999999, 866.0, 866.0, 0.07409222772531161, 0.01338580286052993, 0.051083117943427736], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d1a3a40d-635d-4c29-b894-f5711d1fa8c6", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 0.6716136152416357, 2.5630227695167282], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d1a3a40d-635d-4c29-b894-f5711d1fa8c6", 3, 0, 0.0, 401.0, 243, 495, 465.0, 495.0, 495.0, 495.0, 0.07437524791749306, 0.034524447763784216, 0.04769506458250694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 287.6363636363636, 195, 604, 206.0, 561.4000000000001, 604.0, 604.0, 0.06617854972716389, 0.10256382657911044, 0.1488371093961508], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 782.3636363636364, 166, 1772, 603.5, 1457.0, 1729.2499999999993, 1772.0, 0.11675671085731269, 0.0717187218059079, 0.05279136438177322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 112.35714285714285, 93, 291, 98.5, 197.0, 291.0, 291.0, 0.13155051069787546, 0.09776361195418283, 0.06603218994014452], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8661d409-ad7b-44dc-aa3e-1376f3579bf1", 3, 0, 0.0, 538.6666666666667, 244, 1105, 267.0, 1105.0, 1105.0, 1105.0, 0.022402102810717167, 0.026478527117745454, 0.014365931815466412], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 219.71428571428572, 95, 403, 284.0, 356.5, 403.0, 403.0, 0.13154803852478272, 0.1763272257458304, 0.067132076579751], "isController": false}, {"data": ["login", 22, 0, 0.0, 3021.7727272727275, 1738, 4369, 2930.0, 4025.6, 4317.849999999999, 4369.0, 0.1167641470379059, 31.908814540387127, 0.22017671192161942], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/edd43436-d977-4da1-a241-0814e58b2e4b", 3, 0, 0.0, 803.6666666666666, 191, 1794, 426.0, 1794.0, 1794.0, 1794.0, 0.07647403706441663, 0.03460251026026664, 0.04904096777893905], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 119.5, 93, 331, 106.0, 181.20000000000016, 331.0, 331.0, 0.10151962183940864, 0.0821872719774119, 0.03608705307572729], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=89ca1798-3c61-47e6-a642-80d09fefec52", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.3787506551362684, 1.445394392033543], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b0c0ce7c-48b0-44c0-a117-501b209bb0da", 3, 0, 0.0, 383.0, 231, 642, 276.0, 642.0, 642.0, 642.0, 0.04122464684219205, 0.02650347575303688, 0.026436378346067168], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=66f1d674-be62-4f08-bef6-3e793576705a", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 0.755916579497908, 2.884741108786611], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8a926f00-9cbe-4705-a15c-d682d5d8228a", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef906b28-2e00-4a10-a40e-3f90643b3315", 3, 0, 0.0, 869.0, 363, 1193, 1051.0, 1193.0, 1193.0, 1193.0, 0.02745015509337628, 0.027530575469626402, 0.017603126801416426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 940.857142857143, 201, 1433, 1068.5, 1407.5, 1433.0, 1433.0, 0.13142454822811545, 112.36494514198544, 0.2715581729640929], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f944ba7a-1b95-49a0-b932-767352e0c783", 1, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 294.0, 3.401360544217687, 1.0861766581632655, 2.0295227465986394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ed7e1b26-29ee-4ddc-97d6-125f055e53ae", 1, 0, 0.0, 866.0, 866, 866, 866.0, 866.0, 866.0, 866.0, 1.1547344110854503, 0.2086190098152425, 0.7961352482678984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b1d32289-4d22-4dff-bb89-66f1e23feec3", 3, 0, 0.0, 378.3333333333333, 252, 576, 307.0, 576.0, 576.0, 576.0, 0.041358773574500934, 0.026589706318241976, 0.026522390606043895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2dc255c0-09c6-41e5-9de8-30cffa52fdd4", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 449.85714285714283, 194, 1259, 206.0, 1167.8, 1250.8, 1259.0, 0.14593873352977152, 25.135788716329852, 0.3228853759833491], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 0, 0.0, 1182.4, 976, 1483, 1148.0, 1483.0, 1483.0, 1483.0, 0.09460200934667853, 113.17689215843944, 0.21331644490378976], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1316.8636363636363, 152, 2227, 1323.0, 2153.8, 2217.1, 2227.0, 0.1228384618391151, 0.03884504625984801, 0.05542125915006951], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 116.15789473684212, 94, 303, 105.0, 121.0, 303.0, 303.0, 0.0917426762787239, 0.07122600355623585, 0.03261165445845264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 359.3125, 197, 1204, 292.5, 778.4000000000004, 1204.0, 1204.0, 0.1028899206461487, 7.842750289779816, 0.22975650859130836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3bbd55ac-7f2a-4739-bb50-d3456a2a51f8", 3, 0, 0.0, 463.6666666666667, 340, 562, 489.0, 562.0, 562.0, 562.0, 0.02757961314995955, 0.027660412797859822, 0.017686145151504008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 362.23809523809524, 196, 1183, 208.0, 808.6000000000003, 1152.9999999999995, 1183.0, 0.10298812694022275, 11.878658415662532, 0.22911314195932458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 119.44444444444444, 96, 289, 98.0, 289.0, 289.0, 289.0, 0.06160796796385666, 0.045784827754389565, 0.030924312044357735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 140.66666666666666, 94, 301, 97.0, 301.0, 301.0, 301.0, 0.06160965491747729, 0.016485395944715604, 0.03513675632012377], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 140.22222222222223, 93, 303, 98.0, 303.0, 303.0, 303.0, 0.06161092019332138, 0.016606068333356153, 0.036220482379276824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 120.77777777777777, 92, 294, 98.0, 294.0, 294.0, 294.0, 0.06160881142911906, 0.016605499955504748, 0.036279407511483196], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1102.3103448275858, 760, 1628, 1048.0, 1454.9, 1546.6, 1628.0, 0.2513510116878221, 300.70319372879226, 0.496320064094508], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1316.8636363636363, 152, 2227, 1323.0, 2153.8, 2217.1, 2227.0, 0.1177011887820067, 0.03722049311448046, 0.05310346603250693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 123.14285714285714, 95, 271, 99.0, 271.0, 271.0, 271.0, 0.03665612366728808, 0.009879970832198739, 0.021585588448608115], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=968e166b-7f72-402c-a234-482c390375ea", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 0.36205222945891785, 1.3816695891783568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 96.28571428571429, 93, 99, 96.0, 99.0, 99.0, 99.0, 0.036655931715235776, 0.009879919095122142, 0.021549678606027283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 168.26315789473685, 92, 1050, 99.0, 293.0, 1050.0, 1050.0, 0.09184956008894905, 4.373263658090012, 0.0535820573092913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 163.21052631578948, 92, 575, 100.0, 300.0, 575.0, 575.0, 0.09193533558816841, 1.4462142752592335, 0.053721876557457166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 99.89473684210525, 92, 122, 99.0, 106.0, 122.0, 122.0, 0.09193222175987303, 0.06832072339771815, 0.04614566600056127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 127.00000000000001, 93, 290, 99.0, 290.0, 290.0, 290.0, 0.03665516392712954, 0.009808120035188958, 0.020904898177191062], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 150.73684210526315, 91, 303, 101.0, 302.0, 303.0, 303.0, 0.09184956008894905, 0.03183765590254278, 0.05197695603306584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 99.14285714285715, 92, 103, 100.0, 103.0, 103.0, 103.0, 0.03665497198512855, 0.027240657891291827, 0.01839907773472273], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 130.85714285714286, 100, 298, 104.0, 298.0, 298.0, 298.0, 0.036365525481843214, 0.028623646033560185, 0.012926807886123954], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 652.0769230769231, 426, 1105, 576.0, 1083.4, 1105.0, 1105.0, 0.0747366968679575, 0.01350223527399623, 0.05087058370797498], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1616.8181818181818, 888, 2429, 1652.0, 2047.1, 2371.849999999999, 2429.0, 0.11768607773700371, 0.06091173945372263, 0.05413099864661011], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 228.85714285714286, 199, 383, 201.0, 383.0, 383.0, 383.0, 0.03663578793112472, 0.05677831586591302, 0.08239474570837912], "isController": false}, {"data": ["addBook", 60, 11, 18.333333333333332, 1065.266666666667, 494, 3668, 854.0, 1877.5, 1950.3, 3668.0, 0.283107005010994, 97.0965008195358, 1.0264656390668794], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 176.8793103448276, 96, 412, 103.0, 395.2, 399.59999999999997, 412.0, 0.2526561567513646, 0.18776497586698088, 0.1221335913983647], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 608.603448275862, 455, 873, 572.0, 801.6, 834.8999999999999, 873.0, 0.2525032651284284, 74.24434384523292, 0.12699138822377015], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 145.2413793103448, 93, 302, 102.0, 291.2, 298.0, 302.0, 0.2528081317043191, 0.4473518893049084, 0.12294770467651456], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 924.0000000000001, 657, 1235, 938.5, 1151.5, 1214.2, 1235.0, 0.25181152341630086, 226.58045140743104, 0.1263975810898229], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 122.0952380952381, 95, 449, 105.0, 129.0, 417.29999999999956, 449.0, 0.10623981868404278, 0.07936861454423118, 0.03776493554784333], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 11, 6.179775280898877, 176.0617977528091, 93, 2313, 105.0, 303.1, 373.0499999999996, 1199.1000000000113, 0.7403063537416663, 1.6466690698029869, 0.3544349887290437], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 103.33333333333333, 100, 110, 104.0, 110.0, 110.0, 110.0, 0.0601049833709546, 0.0465461443487959, 0.02136544330764402], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8661d409-ad7b-44dc-aa3e-1376f3579bf1", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.35355002446183953, 1.349223336594912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 105.47619047619047, 98, 152, 103.0, 111.6, 147.99999999999994, 152.0, 0.14869783184399474, 0.12067177564683557, 0.052857432413295005], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/89ca1798-3c61-47e6-a642-80d09fefec52", 3, 0, 0.0, 365.33333333333337, 215, 638, 243.0, 638.0, 638.0, 638.0, 0.02596840510711967, 0.026044484418956935, 0.016652916035490153], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b1d32289-4d22-4dff-bb89-66f1e23feec3", 1, 0, 0.0, 566.0, 566, 566, 566.0, 566.0, 566.0, 566.0, 1.7667844522968197, 0.31919445671378094, 1.2181150618374559], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 287.6666666666667, 195, 584, 204.0, 584.0, 584.0, 584.0, 0.061566245279921196, 0.09541565552659662, 0.13846392859341652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 312.0526315789474, 189, 1149, 206.0, 426.0, 1149.0, 1149.0, 0.09180207472688884, 5.915165899032212, 0.20522878496330332], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b0c0ce7c-48b0-44c0-a117-501b209bb0da", 1, 0, 0.0, 476.0, 476, 476, 476.0, 476.0, 476.0, 476.0, 2.100840336134454, 0.37954634978991597, 1.4484309348739497], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 105.81818181818181, 99, 143, 102.0, 136.40000000000003, 143.0, 143.0, 0.07016290550970161, 0.05817217458763347, 0.024940720317901746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ed7e1b26-29ee-4ddc-97d6-125f055e53ae", 3, 0, 0.0, 544.3333333333334, 338, 763, 532.0, 763.0, 763.0, 763.0, 0.03525968759916787, 0.029394550762196915, 0.022611192893997625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 107.35714285714285, 95, 141, 104.0, 131.0, 141.0, 141.0, 0.1310395177745746, 0.10173478186600274, 0.046580453583930814], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8a926f00-9cbe-4705-a15c-d682d5d8228a", 3, 0, 0.0, 328.3333333333333, 218, 452, 315.0, 452.0, 452.0, 452.0, 0.04198564091080851, 0.02699272161420794, 0.026924385610121337], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf908eb8-ed68-4164-ac8a-0d73d816a8c8", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 1.4129908738938053, 2.6401756084070795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 97.76190476190477, 93, 103, 98.0, 102.0, 102.9, 103.0, 0.10303967027305513, 0.07657537995878413, 0.05172108449252962], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 147.42857142857142, 92, 372, 98.0, 302.6, 365.2999999999999, 372.0, 0.10304422069127951, 0.04231214977232134, 0.05794320668707924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 222.61904761904762, 92, 1089, 100.0, 620.6000000000001, 1047.3999999999994, 1089.0, 0.10304017585523345, 8.855197196203214, 0.05973301861101843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 201.90476190476193, 92, 825, 98.0, 688.2000000000003, 820.9, 825.0, 0.10304320945249708, 2.910663990814434, 0.05983540534009166], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2dc255c0-09c6-41e5-9de8-30cffa52fdd4", 3, 0, 0.0, 339.0, 195, 484, 338.0, 484.0, 484.0, 484.0, 0.0329330142490175, 0.02676879445956924, 0.021119153017761873], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 31.25, 0.37425149700598803], "isController": false}, {"data": ["401/Unauthorized", 11, 68.75, 0.8233532934131736], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1336, 16, "401/Unauthorized", 11, "406/Not Acceptable", 5, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
