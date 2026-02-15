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

    var data = {"OkPercent": 65.19607843137256, "KoPercent": 34.80392156862745};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.49640287769784175, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=16089d3c-2bb9-428c-97fe-00f478d8d171"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6875, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6875, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ccba0881-0f90-4782-b245-1168b6dab697"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6b740809-c6a1-41ab-a3b8-f0087447cccb"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0e40ae26-994f-43e4-a3e9-aeefaefc615b"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=99536db8-7360-467f-87f2-c650802d819d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/603e9936-e094-4c07-b041-bdd17a06b27c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=15952d60-ced9-46fb-948e-5bfebe19f8c7"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/38bf5372-018d-4749-82f3-8e4513c34fac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6b740809-c6a1-41ab-a3b8-f0087447cccb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5824434d-b2cd-49c8-8dcb-11faf56d132d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/99536db8-7360-467f-87f2-c650802d819d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/15952d60-ced9-46fb-948e-5bfebe19f8c7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=38bf5372-018d-4749-82f3-8e4513c34fac"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8813559322033898, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a6fd3bc5-eb3a-471d-8c3d-ad3cde167623"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5824434d-b2cd-49c8-8dcb-11faf56d132d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7a649c52-aef8-4b18-93d0-44a868aa3b7e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a6fd3bc5-eb3a-471d-8c3d-ad3cde167623"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=603e9936-e094-4c07-b041-bdd17a06b27c"], "isController": false}, {"data": [0.11904761904761904, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/962d25c0-1805-46d4-971c-9427205813c8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3346894f-a292-4cc8-ae83-dfaf24cd096d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=962d25c0-1805-46d4-971c-9427205813c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2aaf7097-b895-4d7d-adfd-cd3e8161328b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3346894f-a292-4cc8-ae83-dfaf24cd096d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0e40ae26-994f-43e4-a3e9-aeefaefc615b"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7a649c52-aef8-4b18-93d0-44a868aa3b7e"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/16089d3c-2bb9-428c-97fe-00f478d8d171"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7c0fcde5-5d35-4bfb-92ea-d9bf6a8e7015"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 612, 213, 34.80392156862745, 236.42320261437933, 79, 3814, 87.0, 568.1000000000001, 932.4000000000001, 1614.74, 2.4165366922666878, 2.4755688745039586, 1.1610279473751752], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 55, 100.0, 479.6545454545455, 332, 719, 499.0, 603.4, 640.1999999999998, 719.0, 0.24669097694112158, 1.5872978745890354, 0.41412284117362114], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 18, 100.0, 122.61111111111111, 81, 289, 84.0, 255.70000000000005, 289.0, 289.0, 0.10936265872774774, 0.054360930949632416, 0.0548949283067015], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 117.12499999999999, 83, 259, 87.0, 252.0, 259.0, 259.0, 0.09940728406874014, 0.07717655354946133, 0.03533618300880997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 18, 100.0, 109.33333333333333, 79, 244, 83.0, 243.1, 244.0, 244.0, 0.1478597304024249, 0.0734966823972991, 0.0742186537371547], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=16089d3c-2bb9-428c-97fe-00f478d8d171", 1, 0, 0.0, 584.0, 584, 584, 584.0, 584.0, 584.0, 584.0, 1.7123287671232876, 0.3093562714041096, 1.180570419520548], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 100.33333333333333, 84, 133, 84.0, 133.0, 133.0, 133.0, 0.09240436148586213, 0.027252067547588247, 0.05712105548881907], "isController": false}, {"data": ["https://demoqa.com/books", 55, 55, 100.0, 148.18181818181822, 81, 456, 83.0, 332.4, 340.3999999999999, 456.0, 0.2488451323629881, 0.12369352770777438, 0.12029134816374916], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 397.625, 84, 695, 385.5, 643.9000000000001, 695.0, 695.0, 0.07706238199822757, 0.015573336596443572, 0.051686921129060225], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 397.625, 84, 695, 385.5, 643.9000000000001, 695.0, 695.0, 0.07708243002360649, 0.015577388049814522, 0.05170036764705883], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 984.9565217391306, 102, 3814, 865.0, 1698.2000000000003, 3402.1999999999944, 3814.0, 0.09480352998882967, 0.029722709979514195, 0.04277268638167901], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ccba0881-0f90-4782-b245-1168b6dab697", 2, 0, 0.0, 215.0, 194, 236, 215.0, 236.0, 236.0, 236.0, 0.020277600348774728, 0.028871817684095264, 0.012604192013667102], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6b740809-c6a1-41ab-a3b8-f0087447cccb", 1, 0, 0.0, 160.0, 160, 160, 160.0, 160.0, 160.0, 160.0, 6.25, 1.129150390625, 4.30908203125], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 391.28571428571433, 82, 647, 397.5, 608.0, 647.0, 647.0, 0.07125189580937064, 0.016093306266095297, 0.04763380088148774], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 94.37499999999999, 84, 147, 85.0, 147.0, 147.0, 147.0, 0.06493084864619181, 0.05110767969612363, 0.023080887604700995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e40ae26-994f-43e4-a3e9-aeefaefc615b", 3, 0, 0.0, 265.6666666666667, 158, 343, 296.0, 343.0, 343.0, 343.0, 0.08571428571428572, 0.038783482142857144, 0.054966517857142856], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1081.952380952381, 578, 1628, 1026.0, 1604.4, 1626.7, 1628.0, 0.09046187247460606, 0.04682108633939572, 0.041608927671425246], "isController": false}, {"data": ["goToProfile", 17, 3, 17.647058823529413, 206.23529411764704, 83, 739, 170.0, 366.1999999999997, 739.0, 739.0, 0.0806333034515797, 0.13528589693878035, 0.050919227070497224], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 8, 100.0, 84.0, 83, 87, 84.0, 87.0, 87.0, 87.0, 0.059538871440691844, 0.029595005432922015, 0.02988572257862852], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=99536db8-7360-467f-87f2-c650802d819d", 1, 0, 0.0, 613.0, 613, 613, 613.0, 613.0, 613.0, 613.0, 1.6313213703099512, 0.29472114600326266, 1.124719616639478], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/603e9936-e094-4c07-b041-bdd17a06b27c", 3, 0, 0.0, 548.6666666666666, 233, 844, 569.0, 844.0, 844.0, 844.0, 0.026036920353060638, 0.026113200393157496, 0.016696853221200996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=15952d60-ced9-46fb-948e-5bfebe19f8c7", 1, 0, 0.0, 688.0, 688, 688, 688.0, 688.0, 688.0, 688.0, 1.4534883720930232, 0.26259311409883723, 1.0021121002906979], "isController": false}, {"data": ["addBook", 61, 61, 100.0, 576.0491803278691, 328, 2852, 490.0, 682.8000000000001, 1272.4999999999998, 2852.0, 0.2888353307164537, 0.9296609765711932, 0.5630032422949623], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/38bf5372-018d-4749-82f3-8e4513c34fac", 3, 0, 0.0, 421.3333333333333, 163, 739, 362.0, 739.0, 739.0, 739.0, 0.07040931280510702, 0.03263765020653399, 0.04515180541212918], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b740809-c6a1-41ab-a3b8-f0087447cccb", 3, 0, 0.0, 273.6666666666667, 170, 467, 184.0, 467.0, 467.0, 467.0, 0.06778588697833111, 0.030671348600221436, 0.04346946528232822], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5824434d-b2cd-49c8-8dcb-11faf56d132d", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.441721424205379, 1.6857044621026895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/99536db8-7360-467f-87f2-c650802d819d", 3, 0, 0.0, 363.0, 169, 647, 273.0, 647.0, 647.0, 647.0, 0.02502064202967448, 0.025093944691870793, 0.016045138280748286], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/15952d60-ced9-46fb-948e-5bfebe19f8c7", 3, 0, 0.0, 251.66666666666669, 180, 392, 183.0, 392.0, 392.0, 392.0, 0.03362474781439139, 0.028031568734588657, 0.021562745180452814], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 86.11111111111111, 81, 99, 84.5, 95.4, 99.0, 99.0, 0.1400810913873476, 0.10465042471808679, 0.0497944504540962], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=38bf5372-018d-4749-82f3-8e4513c34fac", 1, 0, 0.0, 182.0, 182, 182, 182.0, 182.0, 182.0, 182.0, 5.4945054945054945, 0.9926596840659341, 3.7882039835164836], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 392.4, 84, 1101, 372.0, 853.2000000000002, 1101.0, 1101.0, 0.07366373976074017, 0.014991722037244387, 0.04973741178767164], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 18, 10.169491525423728, 165.53107344632767, 82, 2436, 87.0, 256.80000000000007, 329.99999999999994, 2025.7199999999993, 0.7283560961759248, 1.5374611517696584, 0.35053101583042884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 126.75, 83, 259, 86.5, 259.0, 259.0, 259.0, 0.05662273685998613, 0.04384944368161035, 0.020127613493198193], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a6fd3bc5-eb3a-471d-8c3d-ad3cde167623", 3, 0, 0.0, 275.0, 178, 374, 273.0, 374.0, 374.0, 374.0, 0.04826876045823143, 0.031032162078452826, 0.03095359964281117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 12, 100.0, 150.66666666666666, 82, 252, 85.5, 250.20000000000002, 252.0, 252.0, 0.07036802476954472, 0.03497785606220533, 0.035321449933150374], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 22, 0, 0.0, 95.27272727272727, 83, 248, 85.5, 103.1, 226.3999999999997, 248.0, 0.11591453937142707, 0.09406736544692959, 0.041203996417186965], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5824434d-b2cd-49c8-8dcb-11faf56d132d", 3, 0, 0.0, 286.6666666666667, 186, 436, 238.0, 436.0, 436.0, 436.0, 0.017203018556322683, 0.02371574986524302, 0.011031883644516825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a649c52-aef8-4b18-93d0-44a868aa3b7e", 3, 0, 0.0, 234.66666666666666, 165, 357, 182.0, 357.0, 357.0, 357.0, 0.025636643308836096, 0.02556153595539224, 0.01644016514271065], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a6fd3bc5-eb3a-471d-8c3d-ad3cde167623", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 0.4856560819892473, 1.8533686155913978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 456.23809523809524, 96, 1555, 284.0, 1248.4, 1530.8999999999996, 1555.0, 0.09377804968450384, 0.05760389965971965, 0.04240159863664578], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=603e9936-e094-4c07-b041-bdd17a06b27c", 1, 0, 0.0, 531.0, 531, 531, 531.0, 531.0, 531.0, 531.0, 1.8832391713747645, 0.34023363935969864, 1.298405131826742], "isController": false}, {"data": ["login", 21, 6, 28.571428571428573, 1870.7142857142858, 1030, 3254, 1692.0, 2664.8, 3195.899999999999, 3254.0, 0.08935219657483247, 0.1342028108711839, 0.13391610599936177], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 8, 100.0, 83.25, 82, 87, 83.0, 87.0, 87.0, 87.0, 0.056867860417836605, 0.028267325149100422, 0.02854500024879689], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 106.27777777777779, 81, 250, 86.5, 247.3, 250.0, 250.0, 0.1086575957695976, 0.08796596376269182, 0.03862437974622415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 16, 100.0, 82.3125, 80, 84, 82.0, 84.0, 84.0, 84.0, 0.09960903453943273, 0.04951269392633912, 0.0499990661653012], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/962d25c0-1805-46d4-971c-9427205813c8", 3, 0, 0.0, 299.0, 179, 521, 197.0, 521.0, 521.0, 521.0, 0.07704555960758128, 0.03486110932764908, 0.049407471493142945], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3346894f-a292-4cc8-ae83-dfaf24cd096d", 1, 0, 0.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 501.0, 1.996007984031936, 0.3606069111776447, 1.3761539421157685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=962d25c0-1805-46d4-971c-9427205813c8", 1, 0, 0.0, 276.0, 276, 276, 276.0, 276.0, 276.0, 276.0, 3.6231884057971016, 0.6545799365942029, 2.4980185688405796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2aaf7097-b895-4d7d-adfd-cd3e8161328b", 2, 0, 0.0, 289.5, 164, 415, 289.5, 415.0, 415.0, 415.0, 0.027290341947984607, 0.031048094110744207, 0.016963186181535354], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3346894f-a292-4cc8-ae83-dfaf24cd096d", 3, 0, 0.0, 702.3333333333334, 168, 1496, 443.0, 1496.0, 1496.0, 1496.0, 0.02792282132186636, 0.028004626462457768, 0.017906236329452062], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 94.16666666666667, 83, 154, 86.5, 139.60000000000005, 154.0, 154.0, 0.07201238613041443, 0.05970558186007993, 0.025598152882295753], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0e40ae26-994f-43e4-a3e9-aeefaefc615b", 1, 0, 0.0, 168.0, 168, 168, 168.0, 168.0, 168.0, 168.0, 5.952380952380952, 1.0753813244047619, 4.103887648809524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 14, 100.0, 94.35714285714286, 81, 244, 82.0, 165.5, 244.0, 244.0, 0.07823807847279271, 0.03888982611587059, 0.03927184798341353], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 98.5, 83, 248, 86.5, 170.5, 248.0, 248.0, 0.07386654425925046, 0.05734756121689855, 0.026257248154655438], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7a649c52-aef8-4b18-93d0-44a868aa3b7e", 1, 0, 0.0, 1101.0, 1101, 1101, 1101.0, 1101.0, 1101.0, 1101.0, 0.9082652134423251, 0.16409088328792007, 0.6262062897366031], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/16089d3c-2bb9-428c-97fe-00f478d8d171", 3, 0, 0.0, 700.0, 156, 1541, 403.0, 1541.0, 1541.0, 1541.0, 0.031088082901554407, 0.025916855569948185, 0.01993604274611399], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 22, 22, 100.0, 109.13636363636365, 81, 280, 84.0, 254.2, 276.84999999999997, 280.0, 0.10822510822510822, 0.053795488365800864, 0.05432393127705628], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 11, 100.0, 83.36363636363636, 81, 87, 83.0, 86.6, 87.0, 87.0, 0.0713474947300146, 0.03546472150154045, 0.04050667869304361], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7c0fcde5-5d35-4bfb-92ea-d9bf6a8e7015", 1, 0, 0.0, 176.0, 176, 176, 176.0, 176.0, 176.0, 176.0, 5.681818181818182, 1.8144087357954546, 3.3902254971590913], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 984.9565217391306, 102, 3814, 865.0, 1698.2000000000003, 3402.1999999999944, 3814.0, 0.09652388126723266, 0.030262072829366764, 0.04354886049361474], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 3.2863849765258215, 1.1437908496732025], "isController": false}, {"data": ["401/Unauthorized", 24, 11.267605633802816, 3.9215686274509802], "isController": false}, {"data": ["404/Not Found", 182, 85.44600938967136, 29.73856209150327], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 612, 213, "404/Not Found", 182, "401/Unauthorized", 24, "406/Not Acceptable", 7, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 18, "404/Not Found", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 18, "404/Not Found", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 55, 55, "404/Not Found", 55, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 8, "404/Not Found", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 18, "401/Unauthorized", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 12, "404/Not Found", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 8, "404/Not Found", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 22, 22, "404/Not Found", 22, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 11, "404/Not Found", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
