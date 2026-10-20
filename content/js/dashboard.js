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

    var data = {"OkPercent": 98.3399209486166, "KoPercent": 1.6600790513833992};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7628378378378379, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aec82ecf-4064-429c-962c-c9d1e4841bd6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a4456ac2-a36e-4460-8acb-0ecfebbeb3f0"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e4f5522d-e4de-4218-bc6a-6b8cc18da3dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a2f4b95b-e901-47a4-9a85-dee9426ffd1c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0d61d5d0-7926-41d8-b856-a2bd9ca6d399"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f8b88d2d-de55-4567-ae66-4626e9359d70"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fae328b0-e297-450b-a251-ad59acabd6c1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aee0db21-a1de-4089-866b-11fd4d456129"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cc7eeedd-3de6-4c82-b973-f5efd2385ea6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6ed66772-3334-4ce7-be51-2596f9ffd953"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1cccc9c4-c054-46cb-9b2f-df9822cccc0a"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6722c53e-5f1e-4139-a110-ab9258170efc"], "isController": false}, {"data": [0.375, 500, 1500, "register"], "isController": true}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fae328b0-e297-450b-a251-ad59acabd6c1"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f8b88d2d-de55-4567-ae66-4626e9359d70"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6e4abb7a-5765-4b0b-8f75-b320cfd98169"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a2f4b95b-e901-47a4-9a85-dee9426ffd1c"], "isController": false}, {"data": [0.3611111111111111, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a4456ac2-a36e-4460-8acb-0ecfebbeb3f0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/55754d1c-6968-4179-9b1d-f0d33406c27f"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aee0db21-a1de-4089-866b-11fd4d456129"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.45454545454545453, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4c77df23-ef5e-48ff-9125-394ec2d84132"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1cccc9c4-c054-46cb-9b2f-df9822cccc0a"], "isController": false}, {"data": [0.26785714285714285, 500, 1500, "addBook"], "isController": true}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7fb49168-4554-4999-828e-7d5c7552323e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/425cda4e-d693-46b5-b05a-0f8384bb2503"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6ed66772-3334-4ce7-be51-2596f9ffd953"], "isController": false}, {"data": [0.9487951807228916, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=425cda4e-d693-46b5-b05a-0f8384bb2503"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7fb49168-4554-4999-828e-7d5c7552323e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4c77df23-ef5e-48ff-9125-394ec2d84132"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6722c53e-5f1e-4139-a110-ab9258170efc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e4f5522d-e4de-4218-bc6a-6b8cc18da3dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aec82ecf-4064-429c-962c-c9d1e4841bd6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1265, 21, 1.6600790513833992, 401.4363636363643, 124, 2292, 145.0, 1029.0, 1256.4, 1673.34, 5.06605900657186, 721.9535032649048, 3.6912232968129883], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aec82ecf-4064-429c-962c-c9d1e4841bd6", 1, 0, 0.0, 811.0, 811, 811, 811.0, 811.0, 811.0, 811.0, 1.2330456226880395, 0.22276703144266335, 0.8501271578298396], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a4456ac2-a36e-4460-8acb-0ecfebbeb3f0", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["see books", 54, 0, 0.0, 1934.7777777777776, 1519, 2566, 1931.5, 2303.5, 2514.5, 2566.0, 0.24886742279349075, 299.47075796980636, 1.2236791735988533], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e4f5522d-e4de-4218-bc6a-6b8cc18da3dc", 3, 0, 0.0, 835.0, 222, 1940, 343.0, 1940.0, 1940.0, 1940.0, 0.016717469198063002, 0.023046380876886985, 0.010720512474018267], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a2f4b95b-e901-47a4-9a85-dee9426ffd1c", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.41531968390804597, 1.5849497126436782], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d61d5d0-7926-41d8-b856-a2bd9ca6d399", 1, 0, 0.0, 317.0, 317, 317, 317.0, 317.0, 317.0, 317.0, 3.1545741324921135, 1.0073688880126184, 1.882270307570978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f8b88d2d-de55-4567-ae66-4626e9359d70", 3, 0, 0.0, 309.6666666666667, 221, 464, 244.0, 464.0, 464.0, 464.0, 0.03959246159531225, 0.025093269116560204, 0.025389697051681356], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 563.0, 131, 1329, 527.0, 999.0000000000002, 1329.0, 1329.0, 0.07600863458088838, 0.014889972750904503, 0.0511771678929393], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 563.0, 131, 1329, 527.0, 999.0000000000002, 1329.0, 1329.0, 0.076226484129646, 0.0149326491371162, 0.051323847582604096], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fae328b0-e297-450b-a251-ad59acabd6c1", 1, 0, 0.0, 818.0, 818, 818, 818.0, 818.0, 818.0, 818.0, 1.2224938875305624, 0.2208607121026895, 0.8428522310513448], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 160.99999999999994, 125, 428, 131.0, 390.0, 428.0, 428.0, 0.12678499933271054, 0.04394726744961964, 0.07174665104097157], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 149.8947368421053, 125, 424, 133.0, 145.0, 424.0, 424.0, 0.1267833073093913, 0.09422079771723318, 0.06363927730178431], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 227.78947368421052, 126, 912, 133.0, 403.0, 912.0, 912.0, 0.1267866914011931, 1.9944531865165689, 0.07408706283615156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 229.52631578947367, 126, 1173, 131.0, 425.0, 1173.0, 1173.0, 0.1267858453613063, 6.0366966302491, 0.07396275415557291], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 239.6, 130, 343, 235.0, 342.4, 343.0, 343.0, 0.07540833614019918, 0.14798395027825675, 0.04874049226561832], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aee0db21-a1de-4089-866b-11fd4d456129", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 0.7889260371179039, 3.0107123362445414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 132.28571428571428, 125, 142, 129.5, 142.0, 142.0, 142.0, 0.08600882204774718, 0.06391866560384336, 0.0431723970044356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 149.85714285714286, 126, 393, 128.0, 267.5, 393.0, 393.0, 0.086012520965552, 0.023015069086485592, 0.04905401586316637], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 780.2, 631, 1036, 685.0, 1036.0, 1036.0, 1036.0, 0.03053808098699078, 8.97920976989556, 0.01741624931289318], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1163.4, 998, 1262, 1175.0, 1262.0, 1262.0, 1262.0, 0.0304369528957717, 27.387223718071635, 0.01732885111155752], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cc7eeedd-3de6-4c82-b973-f5efd2385ea6", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 1.252297794117647, 2.339920343137255], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 307.2, 138, 468, 395.0, 468.0, 468.0, 468.0, 0.030581787933649754, 0.054115429429466164, 0.01693347046716739], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6ed66772-3334-4ce7-be51-2596f9ffd953", 1, 0, 0.0, 807.0, 807, 807, 807.0, 807.0, 807.0, 807.0, 1.2391573729863692, 0.22387120508054523, 0.8543409231722429], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 130.54545454545456, 127, 140, 129.0, 138.6, 140.0, 140.0, 0.053701497783592726, 0.03990902325518952, 0.026955634629654942], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 129.0, 126, 138, 127.0, 137.0, 138.0, 138.0, 0.05370202212523312, 0.021702024566234122, 0.03021692260562211], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1cccc9c4-c054-46cb-9b2f-df9822cccc0a", 3, 0, 0.0, 309.0, 229, 460, 238.0, 460.0, 460.0, 460.0, 0.032731081434930615, 0.027286555844680108, 0.02098965834206162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 306.3636363636363, 131, 1244, 144.0, 1074.2000000000007, 1244.0, 1244.0, 0.05369835194876201, 4.4056913922152035, 0.03114923931402796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 222.9090909090909, 125, 877, 130.0, 784.4000000000003, 877.0, 877.0, 0.053700973452191485, 1.4486009218260285, 0.031203202347708923], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 134.2, 127, 140, 138.0, 140.0, 140.0, 140.0, 0.03062993524831688, 0.02276306711325112, 0.01719942653103731], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 916.3846153846155, 129, 1247, 1126.0, 1221.8, 1247.0, 1247.0, 0.06896112714309964, 47.736091982871116, 0.03598287178004583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 132.28571428571428, 125, 141, 130.0, 140.5, 141.0, 141.0, 0.08600829365688833, 0.023181922899708187, 0.05056346951313162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 771.8461538461539, 126, 1055, 900.0, 1038.6, 1055.0, 1055.0, 0.06896222461527036, 15.602123108180512, 0.03605079034687999], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 206.14285714285717, 126, 426, 131.5, 405.0, 426.0, 426.0, 0.0860130494083531, 0.02318320472334517, 0.05065026249339543], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 505.59999999999997, 132, 903, 468.0, 852.0, 903.0, 903.0, 0.07642494306341742, 0.014971526932149936, 0.051964980817339294], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 441.45454545454544, 261, 1385, 276.0, 1216.6000000000006, 1385.0, 1385.0, 0.05366455748693756, 5.912105763695439, 0.11944461299316508], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 509.090909090909, 185, 1396, 496.5, 818.1999999999999, 1314.9999999999989, 1396.0, 0.0971534052268532, 0.059677238171572916, 0.04392776037112601], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 156.46153846153845, 128, 429, 132.0, 314.5999999999999, 429.0, 429.0, 0.06895637183397428, 0.051245897427396894, 0.03461286633072537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 233.23076923076923, 126, 396, 141.0, 395.2, 396.0, 396.0, 0.06896222461527036, 0.09812818950288846, 0.03487482693134015], "isController": false}, {"data": ["login", 22, 0, 0.0, 2298.909090909091, 1389, 3928, 2101.0, 3399.2, 3861.099999999999, 3928.0, 0.09827702506510852, 26.85673167608116, 0.18531640734933463], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 136.57142857142858, 128, 144, 135.5, 143.5, 144.0, 144.0, 0.08752023905528154, 0.07085378728205897, 0.03111070997668211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 1079.4615384615383, 261, 1390, 1268.0, 1363.6, 1390.0, 1390.0, 0.06890885478784024, 63.43921961550184, 0.14141533983991944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 453.26315789473676, 259, 1299, 287.0, 820.0, 1299.0, 1299.0, 0.12667426712269403, 8.162117331206538, 0.2831875641705169], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 785.2222222222222, 130, 1400, 1163.0, 1400.0, 1400.0, 1400.0, 0.05473953106468388, 36.38845965240398, 0.08469303097345134], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6722c53e-5f1e-4139-a110-ab9258170efc", 3, 0, 0.0, 981.3333333333334, 277, 1993, 674.0, 1993.0, 1993.0, 1993.0, 0.022468039214217774, 0.02655646171446118, 0.014408215251305019], "isController": false}, {"data": ["register", 24, 6, 25.0, 845.0, 249, 1826, 765.0, 1572.5, 1806.25, 1826.0, 0.09526758282325481, 0.030050223878819636, 0.04298205396908567], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 344.07142857142856, 257, 556, 280.0, 544.5, 556.0, 556.0, 0.0859343829604395, 0.13318150952950927, 0.19326844136512905], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 169.49999999999997, 129, 398, 137.5, 388.90000000000003, 398.0, 398.0, 0.12461544452665603, 0.09674734218622219, 0.04429689629658475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fae328b0-e297-450b-a251-ad59acabd6c1", 2, 0, 0.0, 284.0, 226, 342, 284.0, 342.0, 342.0, 342.0, 0.0223074863924333, 0.0253791227023289, 0.013865932703890424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 460.25000000000006, 256, 1409, 285.5, 993.900000000001, 1390.5999999999997, 1409.0, 0.109846654070917, 13.294695487911376, 0.24423716991080452], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 163.0, 126, 392, 129.5, 392.0, 392.0, 392.0, 0.037246202051334575, 0.027680038829165636, 0.0186958475140488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 194.0, 125, 395, 132.5, 395.0, 395.0, 395.0, 0.03720238095238096, 0.016939072381882442, 0.02082643054780506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 287.125, 124, 877, 129.5, 877.0, 877.0, 877.0, 0.03711918040849658, 4.183742154223235, 0.021423276974044413], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f8b88d2d-de55-4567-ae66-4626e9359d70", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e4abb7a-5765-4b0b-8f75-b320cfd98169", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 1.2981135670731707, 2.42552718495935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 264.625, 127, 913, 131.0, 913.0, 913.0, 913.0, 0.03711298119299678, 1.372808811897494, 0.021455942252201265], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 136.0, 132, 140, 136.0, 140.0, 140.0, 140.0, 0.018908595847672353, 0.005576558541012744, 0.011688614425367772], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a2f4b95b-e901-47a4-9a85-dee9426ffd1c", 3, 0, 0.0, 307.3333333333333, 226, 443, 253.0, 443.0, 443.0, 443.0, 0.046541212243441564, 0.029921515032811555, 0.02984576436184241], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1298.9074074074067, 1003, 1990, 1140.5, 1736.5, 1949.75, 1990.0, 0.24546793461461533, 293.6649882607233, 0.48470328495190645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 845.0, 249, 1826, 765.0, 1572.5, 1806.25, 1826.0, 0.0986671709655405, 0.03112255490416951, 0.04451585252546846], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a4456ac2-a36e-4460-8acb-0ecfebbeb3f0", 3, 0, 0.0, 304.3333333333333, 225, 441, 247.0, 441.0, 441.0, 441.0, 0.0438160892679792, 0.028169523536542618, 0.028098208287083017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 165.44444444444446, 126, 420, 138.0, 420.0, 420.0, 420.0, 0.04188754590176905, 0.01129000260633619, 0.024666201346451894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 134.11111111111111, 125, 142, 136.0, 142.0, 142.0, 142.0, 0.04188462182840336, 0.011289214477186843, 0.02462357650458869], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/55754d1c-6968-4179-9b1d-f0d33406c27f", 1, 0, 0.0, 316.0, 316, 316, 316.0, 316.0, 316.0, 316.0, 3.1645569620253164, 1.0105567642405062, 1.8882268591772151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 228.4375, 125, 1178, 130.5, 631.3000000000005, 1178.0, 1178.0, 0.12915099365545743, 7.295777784112007, 0.0752329762846488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 196.5625, 126, 625, 132.0, 478.70000000000016, 625.0, 625.0, 0.12916037682539938, 2.40622691762797, 0.07536457534489857], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aee0db21-a1de-4089-866b-11fd4d456129", 3, 0, 0.0, 314.0, 245, 452, 245.0, 452.0, 452.0, 452.0, 0.0947119179163378, 0.044519534333070244, 0.06073648382004736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 157.88888888888889, 126, 388, 128.0, 388.0, 388.0, 388.0, 0.041887350950842867, 0.011208138828643502, 0.023888879839152572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 134.31249999999997, 127, 151, 130.5, 148.2, 151.0, 151.0, 0.12913952718790608, 0.09597185565429348, 0.06482198923299191], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 161.66666666666666, 127, 379, 136.0, 379.0, 379.0, 379.0, 0.041884037062719016, 0.031126711137430835, 0.021023823291247634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 163.3125, 126, 389, 130.0, 387.6, 389.0, 389.0, 0.12916454756080825, 0.04668655094330484, 0.07298616829333268], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 199.0, 128, 428, 143.0, 428.0, 428.0, 428.0, 0.04302987707798448, 0.03386921965317919, 0.015295776617564795], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 570.8571428571428, 130, 1940, 462.0, 1351.0, 1940.0, 1940.0, 0.07518918135093476, 0.014517553988517538, 0.05116808407224606], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1100.590909090909, 833, 2292, 961.0, 1586.2999999999997, 2195.5499999999984, 2292.0, 0.09666208254063104, 0.050030179439975044, 0.04446078210609103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 330.44444444444446, 257, 800, 276.0, 800.0, 800.0, 800.0, 0.04185657148172263, 0.06486951068505255, 0.0941364102757883], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4c77df23-ef5e-48ff-9125-394ec2d84132", 1, 0, 0.0, 281.0, 281, 281, 281.0, 281.0, 281.0, 281.0, 3.558718861209964, 0.6429326067615658, 2.453569839857651], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1cccc9c4-c054-46cb-9b2f-df9822cccc0a", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.3763834635416667, 1.4363606770833335], "isController": false}, {"data": ["addBook", 56, 7, 12.5, 1220.1428571428576, 668, 2069, 1050.0, 1840.0, 1945.85, 2069.0, 0.2708297061497688, 93.64439133895064, 0.9824755648733872], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 257.4259259259259, 128, 582, 142.0, 532.0, 567.0, 582.0, 0.24645042923449761, 0.183153102194778, 0.11913375241316046], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7fb49168-4554-4999-828e-7d5c7552323e", 3, 0, 0.0, 691.6666666666666, 224, 1282, 569.0, 1282.0, 1282.0, 1282.0, 0.017494037448902836, 0.02411694290237744, 0.01121850708800084], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 779.5555555555553, 623, 1174, 704.0, 1022.0, 1061.5, 1174.0, 0.2461224322365692, 72.36816711143422, 0.1237822779314777], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 209.07407407407405, 126, 558, 137.5, 401.5, 420.0, 558.0, 0.24692035446788665, 0.43693328349200256, 0.12008431301270268], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1037.3148148148146, 868, 1437, 983.5, 1288.0, 1401.25, 1437.0, 0.24607756911817644, 221.42102925076213, 0.12351940481127217], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/425cda4e-d693-46b5-b05a-0f8384bb2503", 3, 0, 0.0, 365.0, 235, 488, 372.0, 488.0, 488.0, 488.0, 0.02249836886825705, 0.022564282058300775, 0.014427664931792447], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 151.89999999999998, 128, 388, 141.0, 153.3, 376.29999999999984, 388.0, 0.10453143782992735, 0.07809233392567815, 0.03715765954110699], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6ed66772-3334-4ce7-be51-2596f9ffd953", 3, 0, 0.0, 655.3333333333334, 233, 971, 762.0, 971.0, 971.0, 971.0, 0.019212295869356386, 0.02270828330131284, 0.012320385046429714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 7, 4.216867469879518, 188.87349397590359, 126, 1029, 139.0, 280.3, 367.20000000000005, 971.380000000001, 0.7023987339897517, 1.550674624100316, 0.33696825559697546], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 172.875, 131, 402, 136.5, 402.0, 402.0, 402.0, 0.03805754300502359, 0.02947229648728878, 0.013528267240066982], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=425cda4e-d693-46b5-b05a-0f8384bb2503", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7fb49168-4554-4999-828e-7d5c7552323e", 1, 0, 0.0, 903.0, 903, 903, 903.0, 903.0, 903.0, 903.0, 1.1074197120708749, 0.20007094407530454, 0.7635139811738648], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 137.1578947368421, 127, 145, 140.0, 144.0, 145.0, 145.0, 0.13178703215603585, 0.10694826535318924, 0.04684617158671587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 464.375, 258, 1041, 273.0, 1041.0, 1041.0, 1041.0, 0.03708854891052388, 5.596644826437181, 0.08222683414464535], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c77df23-ef5e-48ff-9125-394ec2d84132", 3, 0, 0.0, 614.6666666666666, 256, 1000, 588.0, 1000.0, 1000.0, 1000.0, 0.07460830639144492, 0.033758315717483216, 0.04784451939815966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 400.125, 257, 1305, 271.0, 775.1000000000006, 1305.0, 1305.0, 0.12899376798858403, 9.832507449893983, 0.2880472409442344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6722c53e-5f1e-4139-a110-ab9258170efc", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 137.9090909090909, 129, 153, 135.0, 151.20000000000002, 153.0, 153.0, 0.052476659812896856, 0.04350848064565374, 0.018653812667865678], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 133.76923076923077, 128, 145, 132.0, 144.2, 145.0, 145.0, 0.06882494639595521, 0.05343343006326601, 0.024465117664187207], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e4f5522d-e4de-4218-bc6a-6b8cc18da3dc", 1, 0, 0.0, 692.0, 692, 692, 692.0, 692.0, 692.0, 692.0, 1.445086705202312, 0.2610752348265896, 0.9963195447976879], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aec82ecf-4064-429c-962c-c9d1e4841bd6", 3, 0, 0.0, 306.0, 230, 443, 245.0, 443.0, 443.0, 443.0, 0.01848724995994429, 0.0218513035822128, 0.011855430475615318], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 146.79999999999995, 127, 430, 131.5, 143.8, 415.6999999999998, 430.0, 0.11008911714032509, 0.08181427553104238, 0.05525957637707725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 224.6, 126, 428, 138.0, 399.9, 426.59999999999997, 428.0, 0.10992453680548304, 0.04592355160682191, 0.06176814304479974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 261.24999999999994, 125, 900, 131.5, 832.0000000000009, 898.85, 900.0, 0.10993360010553627, 9.918512148349897, 0.06368419099863683], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 264.09999999999997, 126, 979, 131.5, 861.2000000000011, 975.55, 979.0, 0.11008669327095087, 3.263618928030824, 0.06388038392734278], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 28.571428571428573, 0.4743083003952569], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.523809523809524, 0.15810276679841898], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 9.523809523809524, 0.15810276679841898], "isController": false}, {"data": ["401/Unauthorized", 11, 52.38095238095238, 0.8695652173913043], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1265, 21, "401/Unauthorized", 11, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
