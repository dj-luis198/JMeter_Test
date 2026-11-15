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

    var data = {"OkPercent": 97.83132530120481, "KoPercent": 2.1686746987951806};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7414266117969822, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0d5abcc9-89c4-43ee-a199-9adcad3543b3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2cadfc5d-ff59-43b0-968f-f6ba8038d9cc"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9d4b51a8-fc68-4e79-8b5e-fb107cb95fbe"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.717391304347826, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=458da8a2-5650-4071-9b06-5372aa1f74bf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/daba9186-13c7-4707-9892-45b83582abad"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b1051932-86f2-42b0-a8ae-ab99a6e855e1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=55d39dfc-6cd3-4b49-9922-a515ba7b01c4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8785e166-0d7c-4931-ae83-1546c6c37d14"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dc60da1e-670a-402d-bd85-9a44e769afae"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/488ee88d-058c-441f-8fca-bc455752727e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d38df68c-5a77-4a73-ad0d-8a503e721f37"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e41d5f06-3c21-45cd-af8a-971dc86030b6"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2692307692307692, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=41f35867-99fe-4ee6-9760-ffa00827aacb"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9d4b51a8-fc68-4e79-8b5e-fb107cb95fbe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.36538461538461536, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0d5abcc9-89c4-43ee-a199-9adcad3543b3"], "isController": false}, {"data": [0.43478260869565216, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ecaa1e92-6f38-458b-91b3-b11a2f1f9b06"], "isController": false}, {"data": [0.28703703703703703, 500, 1500, "addBook"], "isController": true}, {"data": [0.9038461538461539, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.91875, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/55d39dfc-6cd3-4b49-9922-a515ba7b01c4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ecaa1e92-6f38-458b-91b3-b11a2f1f9b06"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d38df68c-5a77-4a73-ad0d-8a503e721f37"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dc60da1e-670a-402d-bd85-9a44e769afae"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=488ee88d-058c-441f-8fca-bc455752727e"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8785e166-0d7c-4931-ae83-1546c6c37d14"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/458da8a2-5650-4071-9b06-5372aa1f74bf"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=daba9186-13c7-4707-9892-45b83582abad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2cadfc5d-ff59-43b0-968f-f6ba8038d9cc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b1051932-86f2-42b0-a8ae-ab99a6e855e1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/41f35867-99fe-4ee6-9760-ffa00827aacb"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1245, 27, 2.1686746987951806, 416.4915662650606, 125, 5051, 140.0, 1016.4000000000001, 1266.0, 1817.5599999999995, 4.88689487876968, 707.5418348376727, 3.5728059019559355], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 52, 0, 0.0, 1868.75, 1520, 2410, 1861.5, 2218.8, 2346.7, 2410.0, 0.2305884439714425, 277.47473348604274, 1.1338015775353643], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0d5abcc9-89c4-43ee-a199-9adcad3543b3", 1, 0, 0.0, 509.0, 509, 509, 509.0, 509.0, 509.0, 509.0, 1.9646365422396854, 0.35493921905697445, 1.3545248035363457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2cadfc5d-ff59-43b0-968f-f6ba8038d9cc", 1, 0, 0.0, 773.0, 773, 773, 773.0, 773.0, 773.0, 773.0, 1.29366106080207, 0.23371806274256143, 0.8919186610608021], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 625.7333333333333, 130, 1625, 514.0, 1276.4, 1625.0, 1625.0, 0.09584725780995405, 0.01877632804362967, 0.06453465756969694], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 625.7333333333333, 130, 1625, 514.0, 1276.4, 1625.0, 1625.0, 0.09565838477628692, 0.018739328111448395, 0.06440748797892965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 201.9411764705882, 125, 386, 128.0, 385.2, 386.0, 386.0, 0.07829194606145458, 0.034783427782587875, 0.04387731076376096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 128.0, 125, 134, 127.0, 132.4, 134.0, 134.0, 0.07829122493529461, 0.058183224781014835, 0.03929852501634905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 252.94117647058823, 126, 882, 128.0, 775.5999999999999, 882.0, 882.0, 0.07829266720089899, 2.7269307202004294, 0.045312420843810736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 259.52941176470586, 125, 1132, 127.0, 1129.6, 1132.0, 1132.0, 0.07829302777560297, 8.30664378226709, 0.045236171493969135], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 355.6666666666667, 127, 1468, 272.0, 935.2000000000003, 1468.0, 1468.0, 0.09597297401051864, 0.1742196897353705, 0.06203253163909043], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 13, 0, 0.0, 128.6153846153846, 127, 132, 128.0, 132.0, 132.0, 132.0, 0.0951502642249645, 0.07071225690937304, 0.04776097247229663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 13, 0, 0.0, 165.92307692307693, 126, 378, 128.0, 377.2, 378.0, 378.0, 0.09515165710270523, 0.03645383497774915, 0.05365146771431081], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 768.1111111111111, 625, 885, 878.0, 885.0, 885.0, 885.0, 0.08598616578132763, 25.282787749121027, 0.04903898517216341], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 1130.0, 875, 1264, 1132.0, 1264.0, 1264.0, 1264.0, 0.08557654822238492, 77.00192851802812, 0.04872180431020548], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 239.88888888888889, 126, 384, 128.0, 384.0, 384.0, 384.0, 0.08640138242211876, 0.15288994623913982, 0.04784139046224739], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 128.16666666666666, 126, 130, 129.0, 129.7, 130.0, 130.0, 0.06802875348647362, 0.050556524807818776, 0.03414724540239008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 148.33333333333331, 125, 378, 127.0, 303.90000000000026, 378.0, 378.0, 0.06802952481376918, 0.01820321269430933, 0.03879808837035273], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 190.25000000000003, 126, 379, 128.0, 378.4, 379.0, 379.0, 0.06802952481376918, 0.018336082859961224, 0.039993919861219765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 169.83333333333334, 126, 380, 127.5, 379.4, 380.0, 380.0, 0.06802952481376918, 0.018336082859961224, 0.040060354944045716], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 183.66666666666669, 126, 380, 128.0, 380.0, 380.0, 380.0, 0.08640138242211876, 0.06421040236643787, 0.0485164012624202], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 741.0625, 126, 1293, 881.5, 1205.5, 1293.0, 1293.0, 0.08256274768824307, 46.439660902539835, 0.04410334275924703], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 13, 0, 0.0, 204.15384615384613, 125, 873, 128.0, 677.3999999999999, 873.0, 873.0, 0.0951502642249645, 6.609548203215347, 0.055308950163219295], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9d4b51a8-fc68-4e79-8b5e-fb107cb95fbe", 3, 0, 0.0, 384.6666666666667, 272, 548, 334.0, 548.0, 548.0, 548.0, 0.04572473708276177, 0.02939660017527816, 0.029322178402682517], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 581.0625000000001, 126, 1008, 629.0, 943.6, 1008.0, 1008.0, 0.08256317372839812, 15.181041527986336, 0.04418419844058806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 13, 0, 0.0, 206.46153846153848, 126, 645, 128.0, 537.8, 645.0, 645.0, 0.0951502642249645, 2.175776046469925, 0.05540187034312649], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 705.8666666666668, 129, 2315, 509.0, 2229.8, 2315.0, 2315.0, 0.09548180116869726, 0.018704735658633464, 0.06492265178423659], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 320.41666666666663, 254, 508, 259.5, 507.7, 508.0, 508.0, 0.0679794248940654, 0.10535483135437675, 0.15288731985452403], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 630.9565217391304, 157, 1665, 499.0, 1492.2, 1635.7999999999995, 1665.0, 0.09803837989445956, 0.0602208407750147, 0.0443279002843113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 162.125, 127, 382, 128.5, 381.3, 382.0, 382.0, 0.08256146959415878, 0.06135671714956527, 0.041441987667380484], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=458da8a2-5650-4071-9b06-5372aa1f74bf", 1, 0, 0.0, 2315.0, 2315, 2315, 2315.0, 2315.0, 2315.0, 2315.0, 0.4319654427645788, 0.07804063174946005, 0.29781992440604754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 258.5625, 126, 454, 254.5, 405.00000000000006, 454.0, 454.0, 0.08256274768824307, 0.09959534578310766, 0.04275282906415125], "isController": false}, {"data": ["login", 23, 0, 0.0, 2655.2173913043475, 1641, 5301, 2582.0, 4170.4000000000015, 5135.199999999998, 5301.0, 0.09863751570695223, 46.30659042674664, 0.21282534968071465], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/daba9186-13c7-4707-9892-45b83582abad", 3, 0, 0.0, 724.3333333333334, 235, 1230, 708.0, 1230.0, 1230.0, 1230.0, 0.018668442242951108, 0.02206546672661311, 0.011971624745642473], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b1051932-86f2-42b0-a8ae-ab99a6e855e1", 3, 0, 0.0, 693.0, 320, 1434, 325.0, 1434.0, 1434.0, 1434.0, 0.06001560405705483, 0.027155497929461658, 0.03848656900794206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 13, 0, 0.0, 167.0769230769231, 129, 602, 132.0, 414.3999999999998, 602.0, 602.0, 0.09294942836101558, 0.07524909776492375, 0.03304061711270476], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=55d39dfc-6cd3-4b49-9922-a515ba7b01c4", 1, 0, 0.0, 577.0, 577, 577, 577.0, 577.0, 577.0, 577.0, 1.7331022530329288, 0.3131092937608319, 1.1948927642980938], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8785e166-0d7c-4931-ae83-1546c6c37d14", 1, 0, 0.0, 382.0, 382, 382, 382.0, 382.0, 382.0, 382.0, 2.617801047120419, 0.47294257198952877, 1.804851112565445], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dc60da1e-670a-402d-bd85-9a44e769afae", 3, 0, 0.0, 325.3333333333333, 246, 472, 258.0, 472.0, 472.0, 472.0, 0.04545454545454545, 0.029222892992424244, 0.029148910984848484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/488ee88d-058c-441f-8fca-bc455752727e", 3, 0, 0.0, 416.3333333333333, 258, 581, 410.0, 581.0, 581.0, 581.0, 0.026391723555492998, 0.02646904305809698, 0.016924380014427476], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d38df68c-5a77-4a73-ad0d-8a503e721f37", 3, 0, 0.0, 399.6666666666667, 260, 502, 437.0, 502.0, 502.0, 502.0, 0.030137123913807826, 0.030421621502837913, 0.019326215530664523], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 914.5000000000001, 256, 1421, 1031.0, 1334.2, 1421.0, 1421.0, 0.08250697441768123, 61.73984205393378, 0.17236625490529747], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e41d5f06-3c21-45cd-af8a-971dc86030b6", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 1.400596217105263, 2.617016173245614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 464.11764705882354, 253, 1264, 267.0, 1261.6, 1264.0, 1264.0, 0.07824474034252786, 11.119693201510124, 0.17361900190779087], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 4, 30.76923076923077, 949.3846153846154, 126, 1645, 1252.0, 1590.6, 1645.0, 1645.0, 0.12346030751113517, 102.26501437600312, 0.2179011361909646], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=41f35867-99fe-4ee6-9760-ffa00827aacb", 1, 0, 0.0, 2173.0, 2173, 2173, 2173.0, 2173.0, 2173.0, 2173.0, 0.4601932811780948, 0.0831403877128394, 0.31728169581224114], "isController": false}, {"data": ["register", 24, 10, 41.666666666666664, 1141.8333333333333, 167, 5051, 864.5, 3053.5, 4724.5, 5051.0, 0.10115996762881035, 0.03131612279134071, 0.04564053227002968], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 133.22222222222223, 128, 164, 130.0, 146.00000000000003, 164.0, 164.0, 0.09171086620913135, 0.07120130726197209, 0.03260034697277716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 0, 0.0, 392.7692307692307, 254, 1006, 261.0, 810.3999999999999, 1006.0, 1006.0, 0.09506050967057877, 8.884101586779277, 0.21192238172278893], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 458.47058823529414, 255, 1396, 504.0, 888.7999999999995, 1396.0, 1396.0, 0.10888362262217383, 7.821331782809198, 0.24324306067059503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 130.5, 128, 145, 128.5, 145.0, 145.0, 145.0, 0.04831939117567119, 0.03590923504363845, 0.024254069398725576], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9d4b51a8-fc68-4e79-8b5e-fb107cb95fbe", 1, 0, 0.0, 604.0, 604, 604, 604.0, 604.0, 604.0, 604.0, 1.6556291390728477, 0.29911268625827814, 1.1414786837748345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 190.625, 127, 379, 128.5, 379.0, 379.0, 379.0, 0.04824653981847239, 0.012909718662364685, 0.02751560474022254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 128.25, 127, 131, 128.0, 131.0, 131.0, 131.0, 0.048319974873613065, 0.013023743227653522, 0.02840686022843268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 158.875, 126, 381, 127.0, 381.0, 381.0, 381.0, 0.04824595789334025, 0.013003793338439363, 0.028410461532894695], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 129.5, 129, 130, 129.5, 130.0, 130.0, 130.0, 0.09956192751891677, 0.02936299034249303, 0.06154560558542413], "isController": false}, {"data": ["https://demoqa.com/books", 52, 0, 0.0, 1233.5192307692307, 1001, 1824, 1018.0, 1655.9, 1806.75, 1824.0, 0.2274775365932614, 272.1422177528719, 0.44917927635895954], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, 41.666666666666664, 1141.8333333333333, 167, 5051, 864.5, 3053.5, 4724.5, 5051.0, 0.10036381884330699, 0.03106965876301593, 0.04528133232969515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 134.4, 126, 164, 127.0, 164.0, 164.0, 164.0, 0.028195064735868632, 0.007599451042089592, 0.01660314847239139], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 184.2, 127, 377, 130.0, 377.0, 377.0, 377.0, 0.028155214064092528, 0.00758871004071244, 0.01655218639314815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 155.5, 126, 381, 127.5, 380.1, 381.0, 381.0, 0.09053369613873787, 0.02440166028739419, 0.05322391120656269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 141.05555555555554, 126, 379, 127.0, 154.00000000000034, 379.0, 379.0, 0.0905341514938135, 0.024401783019816922, 0.053312591162860884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 143.66666666666666, 126, 378, 128.0, 167.40000000000032, 378.0, 378.0, 0.09052686636222816, 0.06727631377114808, 0.04544024346697781], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 183.0, 126, 376, 127.0, 376.0, 376.0, 376.0, 0.028155372608201095, 0.007533761811178809, 0.016057360940614687], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 197.44444444444446, 126, 381, 128.0, 380.1, 381.0, 381.0, 0.0905327854423281, 0.024224592979685447, 0.05163197919757774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 178.6, 127, 380, 129.0, 380.0, 380.0, 380.0, 0.0281944287808729, 0.020953086232660425, 0.014152281634149092], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 129.8, 126, 133, 130.0, 133.0, 133.0, 133.0, 0.02901814214246747, 0.02284045172541873, 0.010315042714705232], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 764.0666666666666, 126, 2581, 548.0, 1892.8000000000004, 2581.0, 2581.0, 0.09629891182229641, 0.01851371657625269, 0.06553466961448336], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0d5abcc9-89c4-43ee-a199-9adcad3543b3", 3, 0, 0.0, 334.3333333333333, 257, 468, 278.0, 468.0, 468.0, 468.0, 0.018251949916649426, 0.02516178642480805, 0.011704538195247192], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1257.1304347826087, 859, 3345, 1097.0, 2138.4000000000005, 3141.599999999997, 3345.0, 0.09708614918342107, 0.050249667057825353, 0.04465583619667121], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 364.2, 255, 757, 259.0, 757.0, 757.0, 757.0, 0.02813461852270745, 0.04360316366751633, 0.06327541646269068], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ecaa1e92-6f38-458b-91b3-b11a2f1f9b06", 3, 0, 0.0, 382.0, 228, 663, 255.0, 663.0, 663.0, 663.0, 0.024007106103406606, 0.028375586673655404, 0.015395181973864264], "isController": false}, {"data": ["addBook", 54, 9, 16.666666666666668, 1281.3703703703711, 643, 4403, 1033.0, 1976.5, 2966.25, 4403.0, 0.25922156723439393, 81.47451617974616, 0.9413142548460032], "isController": true}, {"data": ["https://demoqa.com/books-0", 52, 0, 0.0, 238.32692307692307, 126, 533, 129.0, 525.8, 528.7, 533.0, 0.22862167509342712, 0.16990341283798638, 0.11051536051879535], "isController": false}, {"data": ["https://demoqa.com/books-3", 52, 0, 0.0, 754.2115384615386, 622, 1038, 645.0, 994.0000000000001, 1015.5999999999999, 1038.0, 0.22854430463197775, 67.19961394691619, 0.11494171570846537], "isController": false}, {"data": ["https://demoqa.com/books-1", 52, 0, 0.0, 187.9615384615385, 126, 393, 130.0, 382.7, 386.75, 393.0, 0.22905269092863245, 0.4053158944948067, 0.11139476570552634], "isController": false}, {"data": ["https://demoqa.com/books-2", 52, 0, 0.0, 988.2499999999999, 868, 1299, 883.0, 1215.9, 1268.8, 1299.0, 0.2280341700433265, 205.18554704629972, 0.11446246426002912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 146.05882352941177, 128, 381, 129.0, 187.39999999999984, 381.0, 381.0, 0.1048269738302543, 0.0783131200977974, 0.037262713353723206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 160, 9, 5.625, 227.59375, 127, 2876, 131.0, 380.9, 474.79999999999995, 2452.6599999999908, 0.6763525995189442, 1.5249554954705513, 0.32380628389689003], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 161.375, 128, 382, 130.0, 382.0, 382.0, 382.0, 0.050258201510258955, 0.038920658005503275, 0.017865220068099864], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/55d39dfc-6cd3-4b49-9922-a515ba7b01c4", 3, 0, 0.0, 1313.6666666666667, 1084, 1468, 1389.0, 1468.0, 1468.0, 1468.0, 0.033152468201257584, 0.02763784865345725, 0.0212598835795825], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 130.52941176470588, 128, 140, 130.0, 136.8, 140.0, 140.0, 0.0800380416103654, 0.06495274665841176, 0.028451022603684574], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ecaa1e92-6f38-458b-91b3-b11a2f1f9b06", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 322.37500000000006, 257, 510, 259.0, 510.0, 510.0, 510.0, 0.04820845335229532, 0.07471368698251238, 0.10842194147493762], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d38df68c-5a77-4a73-ad0d-8a503e721f37", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.3635091800804829, 1.3872296277665996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 356.44444444444446, 254, 760, 259.5, 536.8000000000004, 760.0, 760.0, 0.09046862749040027, 0.1402087029563137, 0.20346606358436703], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dc60da1e-670a-402d-bd85-9a44e769afae", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=488ee88d-058c-441f-8fca-bc455752727e", 1, 0, 0.0, 692.0, 692, 692, 692.0, 692.0, 692.0, 692.0, 1.445086705202312, 0.2610752348265896, 0.9963195447976879], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8785e166-0d7c-4931-ae83-1546c6c37d14", 3, 0, 0.0, 1048.6666666666665, 226, 2581, 339.0, 2581.0, 2581.0, 2581.0, 0.05699088145896656, 0.025786889722644375, 0.0365468868731003], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/458da8a2-5650-4071-9b06-5372aa1f74bf", 3, 0, 0.0, 451.6666666666667, 227, 580, 548.0, 580.0, 580.0, 580.0, 0.03927781196402152, 0.025251848512025554, 0.025187919781615362], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=daba9186-13c7-4707-9892-45b83582abad", 1, 0, 0.0, 621.0, 621, 621, 621.0, 621.0, 621.0, 621.0, 1.6103059581320451, 0.29092441626409016, 1.1102304750402576], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 177.66666666666666, 127, 448, 130.5, 427.9000000000001, 448.0, 448.0, 0.07047878588544848, 0.058434071500728275, 0.025053005920218013], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2cadfc5d-ff59-43b0-968f-f6ba8038d9cc", 3, 0, 0.0, 339.0, 239, 496, 282.0, 496.0, 496.0, 496.0, 0.027022888386463335, 0.022123230563787528, 0.017329130898871344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 149.00000000000003, 129, 381, 132.5, 222.10000000000016, 381.0, 381.0, 0.08139469815284907, 0.06319217288233887, 0.028933271609020567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b1051932-86f2-42b0-a8ae-ab99a6e855e1", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 0.7753822424892703, 2.9590262875536477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 143.6470588235294, 126, 381, 128.0, 188.99999999999983, 381.0, 381.0, 0.10897435897435898, 0.08098582732371795, 0.05470002003205128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 201.8235294117647, 126, 386, 128.0, 382.0, 386.0, 386.0, 0.10897435897435898, 0.03878705929487179, 0.061611077724358976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 253.47058823529412, 126, 1266, 127.0, 560.3999999999994, 1266.0, 1266.0, 0.10897645467541042, 5.795715672817425, 0.06351534404507779], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41f35867-99fe-4ee6-9760-ffa00827aacb", 3, 0, 0.0, 477.33333333333337, 287, 817, 328.0, 817.0, 817.0, 817.0, 0.034931243668712086, 0.02877961514502288, 0.022400569670365498], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 253.52941176470588, 125, 1019, 128.0, 507.79999999999956, 1019.0, 1019.0, 0.10897715326034, 1.9125214949421778, 0.06362217420638991], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 37.03703703703704, 0.8032128514056225], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 7.407407407407407, 0.1606425702811245], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.407407407407407, 0.1606425702811245], "isController": false}, {"data": ["401/Unauthorized", 13, 48.148148148148145, 1.0441767068273093], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1245, 27, "401/Unauthorized", 13, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 160, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
