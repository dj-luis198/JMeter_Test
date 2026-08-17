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

    var data = {"OkPercent": 98.02581624905088, "KoPercent": 1.974183750949127};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7775963422599608, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.017543859649122806, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=71b5bfa9-4457-489c-8e79-9904895a825d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/32e4c9ad-86be-41b5-b87a-39a12baed003"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de26037a-08ae-4d8a-9462-20f8e8ac4fb2"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9905bb01-b39b-45af-a7b1-dd2de139ce43"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8f733795-4e8e-415a-b447-48b57c23798f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/54652292-824f-43c5-96df-899aac6e6a8e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ef391e8-3eb3-4a9a-bdfb-b13c1045a97b"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/cd1bd9e7-13c0-41e9-93d6-c346bba679e5"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9abca902-19a2-4f20-9de6-553eded6d0e2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c04b8e40-8eb3-4fb2-bea8-a6cf5c4db82b"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f942beda-0ef5-4688-8e8a-2afdd3224a64"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8f733795-4e8e-415a-b447-48b57c23798f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b29629a8-decb-454a-94ab-bf826805aeea"], "isController": false}, {"data": [0.6176470588235294, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4c99c3c9-1dff-4dfc-986c-760c497b8d30"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7acd7a8e-ecee-4a42-8b8e-c06d482bae65"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "register"], "isController": true}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.41228070175438597, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=32e4c9ad-86be-41b5-b87a-39a12baed003"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0ef391e8-3eb3-4a9a-bdfb-b13c1045a97b"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f942beda-0ef5-4688-8e8a-2afdd3224a64"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9905bb01-b39b-45af-a7b1-dd2de139ce43"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/de26037a-08ae-4d8a-9462-20f8e8ac4fb2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cd1bd9e7-13c0-41e9-93d6-c346bba679e5"], "isController": false}, {"data": [0.25, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9abca902-19a2-4f20-9de6-553eded6d0e2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/71b5bfa9-4457-489c-8e79-9904895a825d"], "isController": false}, {"data": [0.9075144508670521, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b29629a8-decb-454a-94ab-bf826805aeea"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c04b8e40-8eb3-4fb2-bea8-a6cf5c4db82b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7acd7a8e-ecee-4a42-8b8e-c06d482bae65"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4c99c3c9-1dff-4dfc-986c-760c497b8d30"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1317, 26, 1.974183750949127, 378.8276385725129, 104, 2271, 125.0, 1064.4000000000003, 1285.1999999999998, 1715.719999999997, 5.151775934908465, 733.3970317145205, 3.7761384417540294], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1826.982456140351, 1368, 2511, 1800.0, 2203.4, 2262.199999999999, 2511.0, 0.23737340085287845, 285.64105410057346, 1.1671631575139094], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=71b5bfa9-4457-489c-8e79-9904895a825d", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/32e4c9ad-86be-41b5-b87a-39a12baed003", 3, 0, 0.0, 373.3333333333333, 315, 466, 339.0, 466.0, 466.0, 466.0, 0.03342097054498463, 0.03351888354462814, 0.021432067699746003], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de26037a-08ae-4d8a-9462-20f8e8ac4fb2", 1, 0, 0.0, 574.0, 574, 574, 574.0, 574.0, 574.0, 574.0, 1.7421602787456445, 0.3147457534843206, 1.2011378484320558], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 539.3571428571429, 127, 1052, 486.5, 947.5, 1052.0, 1052.0, 0.0743080066877206, 0.014031234242721796, 0.05025224085082668], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 539.3571428571429, 127, 1052, 486.5, 947.5, 1052.0, 1052.0, 0.07639669529723772, 0.01442563156875157, 0.05166475731771203], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9905bb01-b39b-45af-a7b1-dd2de139ce43", 1, 0, 0.0, 212.0, 212, 212, 212.0, 212.0, 212.0, 212.0, 4.716981132075471, 0.8521889740566038, 3.252137382075472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 162.1875, 106, 332, 112.5, 320.1, 332.0, 332.0, 0.10131006578822396, 0.03661854306627577, 0.05724661798506942], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 126.875, 105, 335, 112.0, 197.10000000000014, 335.0, 335.0, 0.10130878283829219, 0.0752890466210355, 0.05085226013562714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 199.25000000000003, 107, 664, 112.0, 439.30000000000024, 664.0, 664.0, 0.10117233442515144, 1.8848163840691514, 0.059033661932644525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 244.875, 107, 1148, 113.5, 586.6000000000006, 1148.0, 1148.0, 0.10130557560561738, 5.722781892657245, 0.059012476414795685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8f733795-4e8e-415a-b447-48b57c23798f", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54652292-824f-43c5-96df-899aac6e6a8e", 1, 0, 0.0, 309.0, 309, 309, 309.0, 309.0, 309.0, 309.0, 3.236245954692557, 1.0334496359223302, 1.931002224919094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ef391e8-3eb3-4a9a-bdfb-b13c1045a97b", 1, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 4.62962962962963, 0.8364076967592593, 3.191912615740741], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 296.2857142857143, 114, 547, 264.0, 508.0, 547.0, 547.0, 0.07441939582081936, 0.1429365278966421, 0.04810578551001207], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 123.26315789473684, 104, 325, 113.0, 118.0, 325.0, 325.0, 0.08314152437797012, 0.06178779301917506, 0.04173314797878578], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 151.1578947368421, 104, 443, 112.0, 342.0, 443.0, 443.0, 0.08314006913753118, 0.028818699951866276, 0.047048322430315495], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 763.2857142857143, 525, 904, 830.0, 904.0, 904.0, 904.0, 0.07376496374978923, 21.68934856975004, 0.04206908088855168], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 987.7142857142857, 923, 1106, 989.0, 1106.0, 1106.0, 1106.0, 0.07345688081096396, 66.09663047712868, 0.04182164210233593], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 267.7142857142857, 114, 340, 325.0, 340.0, 340.0, 340.0, 0.07408583373022172, 0.13109719796793143, 0.041022136450230194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 113.8125, 107, 122, 114.0, 119.9, 122.0, 122.0, 0.08507561094923113, 0.06322513665270009, 0.04270396877725078], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 179.125, 104, 342, 111.0, 341.3, 342.0, 342.0, 0.08508058726875363, 0.0307523948855932, 0.0480759324300611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 212.375, 106, 1082, 113.5, 563.3000000000005, 1082.0, 1082.0, 0.08508103969030502, 4.8062530659085585, 0.04956136735865912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 172.4375, 105, 909, 109.0, 498.8000000000004, 909.0, 909.0, 0.0850778728404843, 1.5849804154724747, 0.04964260646698181], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 173.00000000000003, 106, 338, 113.0, 338.0, 338.0, 338.0, 0.07408504963698324, 0.05505734645873463, 0.041600491739516965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 197.05263157894737, 108, 1110, 112.0, 333.0, 1110.0, 1110.0, 0.08314116056308445, 3.958627734633107, 0.04850185918950496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 752.8235294117648, 109, 1483, 992.0, 1467.0, 1483.0, 1483.0, 0.08574036807835661, 45.39147688729681, 0.046071656882177604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 172.89473684210523, 105, 874, 112.0, 315.0, 874.0, 874.0, 0.08314152437797012, 1.3078807909165695, 0.04858326432222154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 564.3529411764706, 104, 1000, 854.0, 968.0, 1000.0, 1000.0, 0.08574123295892995, 14.839380191757746, 0.046155853289185006], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 506.0, 117, 1347, 458.5, 1246.5, 1347.0, 1347.0, 0.07678848611499625, 0.014499611601094786, 0.052551048917008104], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/cd1bd9e7-13c0-41e9-93d6-c346bba679e5", 3, 0, 0.0, 889.0, 236, 1729, 702.0, 1729.0, 1729.0, 1729.0, 0.020899078350644737, 0.024702003089580416, 0.013402078239182985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 358.0625, 217, 1192, 234.5, 678.2000000000005, 1192.0, 1192.0, 0.0850245242612166, 6.480966338591569, 0.18986250272344177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9abca902-19a2-4f20-9de6-553eded6d0e2", 3, 0, 0.0, 334.3333333333333, 210, 483, 310.0, 483.0, 483.0, 483.0, 0.09427736400490243, 0.04370148643977247, 0.0604578148078313], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c04b8e40-8eb3-4fb2-bea8-a6cf5c4db82b", 3, 0, 0.0, 363.6666666666667, 224, 610, 257.0, 610.0, 610.0, 610.0, 0.024926466922578393, 0.024999493681140635, 0.01598474604084617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 610.0952380952381, 174, 1303, 516.0, 1235.0000000000002, 1300.6, 1303.0, 0.09466025981987505, 0.05814580412763809, 0.04280048857090053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 115.23529411764709, 106, 145, 112.0, 131.39999999999998, 145.0, 145.0, 0.08574080051646223, 0.06371948163381617, 0.043037862759239834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 191.23529411764707, 107, 343, 116.0, 341.4, 343.0, 343.0, 0.08574296277242305, 0.09869700643576591, 0.04466436043315328], "isController": false}, {"data": ["login", 21, 0, 0.0, 2681.238095238096, 1735, 4038, 2517.0, 3913.6, 4026.5, 4038.0, 0.0939223307049989, 37.5808865890652, 0.19362308605298115], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 139.68421052631584, 108, 350, 116.0, 312.0, 350.0, 350.0, 0.0849089909683647, 0.06873979835231868, 0.030182492883285887], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f942beda-0ef5-4688-8e8a-2afdd3224a64", 3, 0, 0.0, 344.3333333333333, 222, 468, 343.0, 468.0, 468.0, 468.0, 0.07713470290283599, 0.03490144434731186, 0.049464636952665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8f733795-4e8e-415a-b447-48b57c23798f", 3, 0, 0.0, 317.3333333333333, 241, 446, 265.0, 446.0, 446.0, 446.0, 0.022535211267605635, 0.026635856807511737, 0.014451291079812207], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b29629a8-decb-454a-94ab-bf826805aeea", 1, 0, 0.0, 1347.0, 1347, 1347, 1347.0, 1347.0, 1347.0, 1347.0, 0.7423904974016332, 0.13412328322197475, 0.5118434484038604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 869.5882352941178, 222, 1596, 1104.0, 1593.6, 1596.0, 1596.0, 0.08569153065236458, 60.35872085385309, 0.1798252129056486], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c99c3c9-1dff-4dfc-986c-760c497b8d30", 3, 0, 0.0, 520.6666666666666, 431, 577, 554.0, 577.0, 577.0, 577.0, 0.031496393662925594, 0.0256010725834392, 0.020197882654936012], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7acd7a8e-ecee-4a42-8b8e-c06d482bae65", 1, 0, 0.0, 541.0, 541, 541, 541.0, 541.0, 541.0, 541.0, 1.8484288354898337, 0.3339446626617375, 1.2744050369685767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 427.75, 220, 1261, 435.0, 848.0000000000005, 1261.0, 1261.0, 0.10110137308302318, 7.706418841267684, 0.22576262424410926], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, 22.22222222222222, 928.7777777777778, 114, 1445, 1103.0, 1445.0, 1445.0, 1445.0, 0.08178695407208157, 76.10702050126315, 0.15548040748078007], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 1024.5, 262, 1753, 1122.5, 1626.1999999999998, 1741.4499999999998, 1753.0, 0.0962800875273523, 0.030138812910284463, 0.04343886761487965], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 356.26315789473676, 220, 1223, 230.0, 659.0, 1223.0, 1223.0, 0.08309934307782472, 5.354414939621767, 0.1857733309606284], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 128.65, 111, 317, 116.5, 146.10000000000005, 308.54999999999984, 317.0, 0.09232203773201683, 0.07167580077827478, 0.03281759935005285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 408.62499999999994, 218, 717, 444.0, 538.5000000000002, 717.0, 717.0, 0.1109139307897072, 0.17189492984693877, 0.24944802989130435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 4, 0, 0.0, 108.75, 106, 112, 108.5, 112.0, 112.0, 112.0, 0.023020920261287443, 0.01710832062386694, 0.01155542286552905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 4, 0, 0.0, 163.5, 106, 334, 107.0, 334.0, 334.0, 334.0, 0.023020920261287443, 0.006159894679289805, 0.013129118586515496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 4, 0, 0.0, 112.5, 107, 116, 113.5, 116.0, 116.0, 116.0, 0.023021052752742382, 0.006204893124762596, 0.013533861090967691], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 4, 0, 0.0, 107.0, 105, 109, 107.0, 109.0, 109.0, 109.0, 0.023021052752742382, 0.006204893124762596, 0.013556342587796541], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 117.0, 117, 117, 117.0, 117.0, 117.0, 117.0, 8.547008547008549, 2.520699786324786, 5.2834535256410255], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1252.9298245614034, 854, 2034, 1150.0, 1735.4, 1785.9999999999989, 2034.0, 0.244988481243338, 293.09139534371457, 0.48375655183010696], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 1024.5, 262, 1753, 1122.5, 1626.1999999999998, 1741.4499999999998, 1753.0, 0.09213926430985596, 0.028842599960631404, 0.041570644639798295], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=32e4c9ad-86be-41b5-b87a-39a12baed003", 1, 0, 0.0, 1146.0, 1146, 1146, 1146.0, 1146.0, 1146.0, 1146.0, 0.8726003490401396, 0.1576475239965096, 0.6016170375218151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 142.42857142857144, 105, 325, 113.0, 325.0, 325.0, 325.0, 0.03823256322027418, 0.010304870555464526, 0.0225139019744388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 112.14285714285714, 107, 118, 113.0, 118.0, 118.0, 118.0, 0.038235069205475265, 0.010305545996788254, 0.022478038732125106], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ef391e8-3eb3-4a9a-bdfb-b13c1045a97b", 3, 0, 0.0, 326.3333333333333, 214, 475, 290.0, 475.0, 475.0, 475.0, 0.07840472519143821, 0.03547609635940726, 0.05027907181872828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 174.99999999999997, 105, 942, 113.5, 333.8, 911.6499999999995, 942.0, 0.09113776384382632, 4.123632257129252, 0.05318742936823302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 170.3, 105, 874, 111.5, 334.8, 847.0999999999997, 874.0, 0.09113568736813805, 1.363181623741758, 0.053275217244694764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 110.99999999999999, 104, 116, 112.0, 116.0, 116.0, 116.0, 0.038235904606880276, 0.010231091662387887, 0.021806414346111407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 125.55, 109, 317, 116.0, 128.10000000000002, 307.59999999999985, 317.0, 0.09113568736813805, 0.0677287676632354, 0.04574584307345992], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f942beda-0ef5-4688-8e8a-2afdd3224a64", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 0.7923862390350876, 3.0239172149122804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 113.57142857142857, 108, 119, 114.0, 119.0, 119.0, 119.0, 0.03823256322027418, 0.028413067002567044, 0.019190954585176688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 132.15, 105, 323, 113.0, 291.3000000000004, 322.34999999999997, 323.0, 0.0911331957222078, 0.031229139041916713, 0.05159171246109752], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 124.85714285714285, 117, 155, 119.0, 155.0, 155.0, 155.0, 0.037533713317497684, 0.029543137630764778, 0.013342062155829254], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 509.85714285714295, 114, 871, 479.0, 786.5, 871.0, 871.0, 0.07690068276820486, 0.014370600525671096, 0.052338166976100366], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1419.6190476190475, 859, 2271, 1363.0, 1956.0, 2239.8999999999996, 2271.0, 0.09307602981978708, 0.04817411699656948, 0.042811337934687214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 261.14285714285717, 224, 442, 234.0, 442.0, 442.0, 442.0, 0.03820731287968517, 0.0592138725977152, 0.08592914215030756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9905bb01-b39b-45af-a7b1-dd2de139ce43", 3, 0, 0.0, 411.0, 298, 469, 466.0, 469.0, 469.0, 469.0, 0.0683480281593876, 0.03092570284555624, 0.04382995295377395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de26037a-08ae-4d8a-9462-20f8e8ac4fb2", 3, 0, 0.0, 347.6666666666667, 263, 493, 287.0, 493.0, 493.0, 493.0, 0.030599130984680034, 0.025509236475184105, 0.019622489596295464], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cd1bd9e7-13c0-41e9-93d6-c346bba679e5", 1, 0, 0.0, 509.0, 509, 509, 509.0, 509.0, 509.0, 509.0, 1.9646365422396854, 0.35493921905697445, 1.3545248035363457], "isController": false}, {"data": ["addBook", 58, 15, 25.862068965517242, 1050.7068965517235, 558, 2125, 889.0, 1947.2, 2109.45, 2125.0, 0.27699904960670907, 81.09004927926519, 1.0068732627861328], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9abca902-19a2-4f20-9de6-553eded6d0e2", 1, 0, 0.0, 283.0, 283, 283, 283.0, 283.0, 283.0, 283.0, 3.5335689045936394, 0.6383889134275619, 2.4362301236749118], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 175.43859649122814, 107, 485, 116.0, 435.4, 441.4999999999999, 485.0, 0.24632244905014608, 0.18305799192105582, 0.11907188699201397], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 718.4561403508773, 527, 1138, 653.0, 925.0000000000002, 1004.2, 1138.0, 0.24622562042376725, 72.3985078646407, 0.12383417433421888], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 167.75438596491225, 106, 446, 113.0, 333.0, 344.1, 446.0, 0.24647049921086198, 0.43613725055672065, 0.1198655357490325], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1074.0526315789475, 737, 1594, 1023.0, 1305.6000000000001, 1384.0999999999992, 1594.0, 0.24548755119707483, 220.89013008821402, 0.1232232434719692], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 117.31250000000001, 112, 134, 116.0, 127.7, 134.0, 134.0, 0.10980036920374145, 0.0820285961336545, 0.03903059999039247], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/71b5bfa9-4457-489c-8e79-9904895a825d", 3, 0, 0.0, 439.6666666666667, 338, 547, 434.0, 547.0, 547.0, 547.0, 0.020919626793857997, 0.024726290653808068, 0.013415255463509197], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 15, 8.670520231213873, 164.63583815028906, 106, 611, 118.0, 306.6, 337.9, 583.6199999999997, 0.7258172786467074, 1.6005124838998623, 0.3465774227822716], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 4, 0, 0.0, 115.25, 112, 118, 115.5, 118.0, 118.0, 118.0, 0.023215591591312725, 0.01797848059756933, 0.008252417323474445], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 130.68750000000003, 107, 348, 115.5, 202.40000000000015, 348.0, 348.0, 0.10085919426111184, 0.08184960003025776, 0.0358522917100046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 4, 0, 0.0, 277.75, 218, 447, 223.0, 447.0, 447.0, 447.0, 0.02300648782956794, 0.03565556268117609, 0.051742130343256795], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b29629a8-decb-454a-94ab-bf826805aeea", 3, 0, 0.0, 442.33333333333337, 226, 871, 230.0, 871.0, 871.0, 871.0, 0.03386960203217612, 0.021774890629410102, 0.021719764324019192], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 324.5, 217, 1259, 232.0, 453.5, 1218.7499999999995, 1259.0, 0.09108422102497074, 5.5825243322957325, 0.20368531027839892], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c04b8e40-8eb3-4fb2-bea8-a6cf5c4db82b", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 144.9375, 110, 341, 118.0, 323.5, 341.0, 341.0, 0.08861369413875797, 0.07346975226934133, 0.03149939908838662], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 131.7058823529412, 109, 338, 116.0, 179.59999999999985, 338.0, 338.0, 0.08521644978244741, 0.06615925544633369, 0.030291784883604355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7acd7a8e-ecee-4a42-8b8e-c06d482bae65", 3, 0, 0.0, 323.6666666666667, 208, 533, 230.0, 533.0, 533.0, 533.0, 0.017185772471829654, 0.023691974745507355, 0.011020824143718888], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4c99c3c9-1dff-4dfc-986c-760c497b8d30", 1, 0, 0.0, 565.0, 565, 565, 565.0, 565.0, 565.0, 565.0, 1.7699115044247788, 0.3197594026548673, 1.2202710176991152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 126.25, 105, 351, 110.0, 193.50000000000017, 351.0, 351.0, 0.11118214414764989, 0.0826265739222281, 0.055808224699113326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 251.37499999999994, 107, 348, 327.0, 343.8, 348.0, 348.0, 0.11099934094141316, 0.029700995525339065, 0.06330431163064969], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 166.125, 105, 365, 111.5, 344.0, 365.0, 365.0, 0.11118137156119491, 0.02996685405360332, 0.06536248601546811], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 218.3125, 106, 340, 213.5, 335.8, 340.0, 340.0, 0.11118600724098872, 0.029968103514172742, 0.06547379137335567], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 26.923076923076923, 0.5315110098709187], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 3.8461538461538463, 0.07593014426727411], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 3.8461538461538463, 0.07593014426727411], "isController": false}, {"data": ["401/Unauthorized", 17, 65.38461538461539, 1.2908124525436597], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1317, 26, "401/Unauthorized", 17, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
