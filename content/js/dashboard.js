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

    var data = {"OkPercent": 97.86921381337253, "KoPercent": 2.1307861866274798};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8091194968553459, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3879310344827586, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/be097f0d-62dc-470d-bd6b-521ec2250f42"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/907d5028-4977-4937-b924-31c788b458f1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d6e4ba2b-db91-46d5-be14-4a216ca2115b"], "isController": false}, {"data": [0.6875, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6875, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a10f1e26-0803-48fe-b8be-1149c37a7362"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e2d35973-ffd8-4963-9c26-02cb39e92e90"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2727c2a4-2c68-413f-8967-f1c620f18dc9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.782608695652174, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.043478260869565216, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b1f27626-d552-4fc8-bb9a-72a013b1f6d1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ded5111a-9f1f-4aa9-993e-26674ced52cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0e401c83-9d76-4b26-a4ba-6b444ccd21b1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b5ca9981-ee71-41bb-894d-a22a225bf2d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/031b8601-c448-4b48-b2bb-f44843b1c8cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1b38a685-d582-4d41-9f58-c1a7d5e159a0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/151f50a4-dce5-49d3-9378-4e7f6b1444d9"], "isController": false}, {"data": [0.28, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=379b957d-5e62-4924-be41-3e3cc03ac785"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=907d5028-4977-4937-b924-31c788b458f1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49137931034482757, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.28, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.391304347826087, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c5a1fd95-07a4-4c18-a231-579660e95025"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a10f1e26-0803-48fe-b8be-1149c37a7362"], "isController": false}, {"data": [0.3416666666666667, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e2d35973-ffd8-4963-9c26-02cb39e92e90"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2727c2a4-2c68-413f-8967-f1c620f18dc9"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8362068965517241, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9157303370786517, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be097f0d-62dc-470d-bd6b-521ec2250f42"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1b38a685-d582-4d41-9f58-c1a7d5e159a0"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c5a1fd95-07a4-4c18-a231-579660e95025"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b1f27626-d552-4fc8-bb9a-72a013b1f6d1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b5ca9981-ee71-41bb-894d-a22a225bf2d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0e401c83-9d76-4b26-a4ba-6b444ccd21b1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/379b957d-5e62-4924-be41-3e3cc03ac785"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d6e4ba2b-db91-46d5-be14-4a216ca2115b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=151f50a4-dce5-49d3-9378-4e7f6b1444d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4ac1aafa-19d3-47f6-a62c-a6d2bcdf374a"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1361, 29, 2.1307861866274798, 302.815576781778, 79, 3591, 93.0, 834.1999999999998, 1060.6999999999996, 1475.039999999999, 5.45088992486503, 779.7513987367532, 3.9822914288660867], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1349.7241379310342, 992, 1989, 1347.0, 1663.0, 1754.6999999999998, 1989.0, 0.26894185291662803, 323.6274284101711, 1.3223849896828341], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/be097f0d-62dc-470d-bd6b-521ec2250f42", 3, 0, 0.0, 272.6666666666667, 172, 378, 268.0, 378.0, 378.0, 378.0, 0.06775526797208484, 0.03145150134381281, 0.043449830047202834], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/907d5028-4977-4937-b924-31c788b458f1", 3, 0, 0.0, 627.6666666666666, 197, 1209, 477.0, 1209.0, 1209.0, 1209.0, 0.0473305566073457, 0.030428987402183517, 0.030351951991038746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d6e4ba2b-db91-46d5-be14-4a216ca2115b", 3, 0, 0.0, 747.6666666666666, 193, 1155, 895.0, 1155.0, 1155.0, 1155.0, 0.05347784234732076, 0.03438109981639274, 0.0342940590573639], "isController": false}, {"data": ["deleteBook", 16, 2, 12.5, 476.125, 86, 852, 444.5, 844.3, 852.0, 852.0, 0.09155727479771565, 0.01784875095849022, 0.06168269038190829], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, 12.5, 476.125, 86, 852, 444.5, 844.3, 852.0, 852.0, 0.08974042581832051, 0.017494562992170146, 0.06045866822403697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 105.07142857142856, 81, 244, 82.0, 243.5, 244.0, 244.0, 0.07472166180975866, 0.04404283219115936, 0.041269958022437846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 85.71428571428571, 80, 107, 83.0, 102.0, 107.0, 107.0, 0.07472206062094032, 0.055530750129429284, 0.03750697183512044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 205.78571428571428, 80, 671, 83.0, 663.5, 671.0, 671.0, 0.07472126300283408, 4.72379526974376, 0.042624894589646835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 299.6428571428571, 81, 1119, 83.0, 1044.5, 1119.0, 1119.0, 0.07472166180975866, 14.42325614152016, 0.04255215171699704], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a10f1e26-0803-48fe-b8be-1149c37a7362", 1, 0, 0.0, 614.0, 614, 614, 614.0, 614.0, 614.0, 614.0, 1.6286644951140066, 0.2942411441368078, 1.1228878257328991], "isController": false}, {"data": ["goToProfile", 17, 3, 17.647058823529413, 243.64705882352936, 81, 1155, 197.0, 484.5999999999994, 1155.0, 1155.0, 0.09270873098107651, 0.16389122743633092, 0.05991876908709167], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 83.88888888888887, 81, 92, 83.0, 90.2, 92.0, 92.0, 0.09454973315964198, 0.07026596380321048, 0.04745953402739841], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 100.1111111111111, 80, 243, 82.0, 243.0, 243.0, 243.0, 0.09455519659601293, 0.02530090221416752, 0.05392601055866362], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 622.2857142857142, 409, 737, 639.0, 737.0, 737.0, 737.0, 0.09924432535125402, 29.18112687500886, 0.05660027930188706], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e2d35973-ffd8-4963-9c26-02cb39e92e90", 3, 0, 0.0, 379.66666666666663, 192, 707, 240.0, 707.0, 707.0, 707.0, 0.04227495631587847, 0.027178723542923174, 0.027109916647877798], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 762.4285714285714, 554, 982, 714.0, 982.0, 982.0, 982.0, 0.09925980545078131, 89.31414742473979, 0.05651217439238819], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 129.28571428571428, 81, 244, 84.0, 244.0, 244.0, 244.0, 0.10004716509211485, 0.17703658510440637, 0.05539720957737219], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 95.57142857142856, 82, 243, 83.0, 167.0, 243.0, 243.0, 0.07448591418158601, 0.055355254582213825, 0.037388437391928916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 106.07142857142857, 80, 245, 83.0, 244.0, 245.0, 245.0, 0.07448631048022387, 0.019930907296466155, 0.04248047394575268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 106.21428571428572, 81, 245, 82.5, 242.5, 245.0, 245.0, 0.07442176943072662, 0.020058992541875535, 0.04375186054423577], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 82.85714285714285, 81, 91, 82.0, 87.5, 91.0, 91.0, 0.07448670678307875, 0.020076495187626695, 0.04386277752948876], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 83.0, 82, 85, 83.0, 85.0, 85.0, 85.0, 0.10004430533521988, 0.07434933238291244, 0.05617722223413226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 576.0, 80, 1062, 808.0, 1054.0, 1062.0, 1062.0, 0.09592921552473281, 50.78551523511122, 0.05154652355344386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 109.66666666666667, 80, 247, 83.0, 243.4, 247.0, 247.0, 0.09455072646474834, 0.0254843754924517, 0.05558548567556494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 413.64705882352945, 80, 730, 631.0, 728.4, 730.0, 730.0, 0.0959286742092938, 16.602537877719154, 0.051639913029371105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 118.05555555555559, 80, 244, 83.0, 244.0, 244.0, 244.0, 0.09455619001591696, 0.02548584809022762, 0.0556810376753886], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 395.46666666666664, 86, 814, 416.0, 694.0000000000001, 814.0, 814.0, 0.09355062024061218, 0.0183264203322918, 0.06360954933547876], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2727c2a4-2c68-413f-8967-f1c620f18dc9", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 214.6428571428571, 165, 488, 170.0, 408.5, 488.0, 488.0, 0.07438855266443856, 0.1152877276156875, 0.1673015984240254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 498.3478260869565, 95, 1480, 460.0, 1035.2000000000003, 1407.999999999999, 1480.0, 0.10123150324380947, 0.06218224173862906, 0.045771666017464636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 82.99999999999999, 80, 85, 83.0, 85.0, 85.0, 85.0, 0.09592759159674298, 0.07128993867687637, 0.048151154375708875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 111.29411764705884, 80, 248, 82.0, 245.6, 248.0, 248.0, 0.09592975684628102, 0.11042282098378788, 0.04997076258513766], "isController": false}, {"data": ["login", 23, 0, 0.0, 2381.9565217391305, 1279, 4646, 2301.0, 3600.0000000000014, 4519.5999999999985, 4646.0, 0.10527664872386393, 38.474382050388606, 0.21197027679748434], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b1f27626-d552-4fc8-bb9a-72a013b1f6d1", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ded5111a-9f1f-4aa9-993e-26674ced52cf", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 1.0574037665562914, 1.9757605546357617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 90.0, 83, 120, 85.5, 118.2, 120.0, 120.0, 0.09743845137821276, 0.07888327753177576, 0.03463632451334907], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0e401c83-9d76-4b26-a4ba-6b444ccd21b1", 1, 0, 0.0, 814.0, 814, 814, 814.0, 814.0, 814.0, 814.0, 1.2285012285012284, 0.22194602272727273, 0.8469940110565111], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b5ca9981-ee71-41bb-894d-a22a225bf2d5", 1, 0, 0.0, 357.0, 357, 357, 357.0, 357.0, 357.0, 357.0, 2.8011204481792715, 0.506061799719888, 1.9312412464985995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/031b8601-c448-4b48-b2bb-f44843b1c8cf", 1, 0, 0.0, 181.0, 181, 181, 181.0, 181.0, 181.0, 181.0, 5.524861878453039, 1.7642869475138123, 3.296572859116022], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b38a685-d582-4d41-9f58-c1a7d5e159a0", 3, 0, 0.0, 334.6666666666667, 217, 470, 317.0, 470.0, 470.0, 470.0, 0.03263068589701755, 0.0265230542593922, 0.02092527708890774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 660.2941176470588, 164, 1146, 894.0, 1139.6, 1146.0, 1146.0, 0.09588322551170621, 67.53746606192082, 0.20121266723162567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 409.3571428571429, 165, 1203, 258.0, 1128.5, 1203.0, 1203.0, 0.07468817686160281, 19.23802492617874, 0.16388053092624008], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, 41.666666666666664, 528.6666666666667, 81, 1065, 683.0, 1046.4, 1065.0, 1065.0, 0.14573187763380008, 101.71807542080079, 0.23171463421298713], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/151f50a4-dce5-49d3-9378-4e7f6b1444d9", 3, 0, 0.0, 255.66666666666669, 170, 388, 209.0, 388.0, 388.0, 388.0, 0.10255007862172694, 0.047602998735215694, 0.06576290849114651], "isController": false}, {"data": ["register", 25, 8, 32.0, 986.2799999999997, 97, 1957, 1026.0, 1606.4, 1861.8999999999999, 1957.0, 0.1015380991255539, 0.03177825196070069, 0.04581113456641201], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=379b957d-5e62-4924-be41-3e3cc03ac785", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 0.4856560819892473, 1.8533686155913978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 230.55555555555554, 164, 335, 171.0, 330.5, 335.0, 335.0, 0.09450455984501253, 0.14646360983792467, 0.21254297004205452], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 22, 0, 0.0, 119.95454545454545, 83, 486, 85.5, 248.2, 450.5999999999995, 486.0, 0.11929938723496557, 0.09262012973808362, 0.04240720405617917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 344.5, 165, 1058, 325.5, 991.5000000000001, 1058.0, 1058.0, 0.09928145050199183, 14.981524827343353, 0.22011104785365915], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=907d5028-4977-4937-b924-31c788b458f1", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.4143671158256881, 1.581314506880734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 84.42857142857143, 81, 89, 84.0, 89.0, 89.0, 89.0, 0.042919770685796624, 0.03189643114442503, 0.021543713020019006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 83.14285714285715, 80, 88, 83.0, 88.0, 88.0, 88.0, 0.04292187605388535, 0.020694475954551865, 0.023963915732093916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 196.71428571428572, 80, 880, 83.0, 880.0, 880.0, 880.0, 0.04271235668478891, 5.500246787801961, 0.024585823616272186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 161.42857142857144, 81, 635, 83.0, 635.0, 635.0, 635.0, 0.04277630437173831, 1.8066901567140465, 0.024664406524608596], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 87.0, 86, 88, 87.0, 88.0, 88.0, 88.0, 0.0613195977434388, 0.01808449074074074, 0.037905571651949965], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 940.5689655172412, 646, 1629, 867.0, 1306.8000000000002, 1410.4999999999998, 1629.0, 0.27271786866283604, 326.2653829922792, 0.5385112601916549], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, 32.0, 986.2799999999997, 97, 1957, 1026.0, 1606.4, 1861.8999999999999, 1957.0, 0.10199835170663643, 0.03192229663568637, 0.04601878758639261], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 115.4, 80, 246, 83.0, 245.6, 246.0, 246.0, 0.04537163909583398, 0.012229074600049001, 0.0267178695066288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 99.69999999999999, 81, 247, 83.0, 231.40000000000006, 247.0, 247.0, 0.04533790339399545, 0.012219981774162836, 0.026653728362485606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 22, 0, 0.0, 111.68181818181817, 81, 244, 82.5, 242.7, 243.85, 244.0, 0.11839095923584017, 0.03191006323153505, 0.0696009350195076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 22, 0, 0.0, 111.95454545454544, 80, 252, 82.0, 243.4, 250.79999999999998, 252.0, 0.11839032212930375, 0.03190989151141391, 0.06971617601950211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 99.1, 80, 242, 83.0, 226.90000000000006, 242.0, 242.0, 0.04537163909583398, 0.012140458117439952, 0.025876012921842818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 22, 0, 0.0, 91.36363636363637, 82, 245, 83.0, 98.99999999999999, 223.99999999999972, 245.0, 0.11838904793680179, 0.08798248582022085, 0.05942575257765245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 100.5, 82, 243, 83.5, 227.90000000000006, 243.0, 243.0, 0.0453697864444152, 0.033717194808789035, 0.02277350608635685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 22, 0, 0.0, 96.63636363636364, 80, 243, 82.0, 193.4999999999999, 242.54999999999998, 243.0, 0.11839159634923369, 0.03167900136688479, 0.06752020729292232], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 88.89999999999999, 84, 96, 89.0, 95.9, 96.0, 96.0, 0.04756333057466016, 0.037437543401539146, 0.016907277665211228], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 668.3333333333334, 82, 2434, 470.0, 1679.8000000000004, 2434.0, 2434.0, 0.09460260598645291, 0.018187597361848662, 0.06438027606617137], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1413.5217391304352, 838, 3591, 1237.0, 2264.6000000000004, 3349.7999999999965, 3591.0, 0.1020439853944, 0.052815734627960936, 0.04693624718824453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 234.20000000000002, 165, 485, 173.0, 469.6, 485.0, 485.0, 0.045318795063876836, 0.0702352810218482, 0.10192303225791834], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c5a1fd95-07a4-4c18-a231-579660e95025", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 0.4856560819892473, 1.8533686155913978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a10f1e26-0803-48fe-b8be-1149c37a7362", 3, 0, 0.0, 400.3333333333333, 303, 498, 400.0, 498.0, 498.0, 498.0, 0.016727256506902783, 0.023059873472243905, 0.010726788840689607], "isController": false}, {"data": ["addBook", 60, 12, 20.0, 891.6, 419, 2361, 710.0, 1524.4, 1715.9999999999995, 2361.0, 0.2866808095866063, 92.61377999248657, 1.0404777625279513], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e2d35973-ffd8-4963-9c26-02cb39e92e90", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2727c2a4-2c68-413f-8967-f1c620f18dc9", 3, 0, 0.0, 552.0, 219, 1177, 260.0, 1177.0, 1177.0, 1177.0, 0.022983398325276374, 0.027165598736679206, 0.01473870270208153], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 153.70689655172407, 82, 527, 85.0, 335.0, 342.59999999999997, 527.0, 0.2736765614899329, 0.20338658524788963, 0.13229482220460625], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 513.448275862069, 399, 729, 484.5, 649.0, 685.2499999999999, 729.0, 0.2738626437188659, 80.52471034893878, 0.13773365382345304], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 134.8620689655172, 81, 409, 86.0, 248.1, 270.64999999999975, 409.0, 0.2742744730856351, 0.48533725120231525, 0.13338739023109988], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 784.2241379310346, 557, 1121, 751.0, 1034.7, 1052.8999999999999, 1121.0, 0.2734365792141056, 246.03871462708906, 0.1372523454258303], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 107.93749999999999, 84, 246, 86.0, 244.6, 246.0, 246.0, 0.09680542110358181, 0.07232045619554694, 0.03441130203291384], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 12, 6.741573033707865, 149.10112359550567, 81, 2026, 89.0, 272.2, 400.4499999999998, 952.3900000000108, 0.7283410600226685, 1.6201225060456401, 0.34856253657049563], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 88.85714285714285, 83, 104, 86.0, 104.0, 104.0, 104.0, 0.043538295040366215, 0.033716667936533606, 0.01547650331513018], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be097f0d-62dc-470d-bd6b-521ec2250f42", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 0.9609790558510638, 3.6673038563829787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 86.35714285714286, 83, 98, 84.5, 96.5, 98.0, 98.0, 0.0777376133442166, 0.06308589520414452, 0.027633292243451995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1b38a685-d582-4d41-9f58-c1a7d5e159a0", 1, 0, 0.0, 545.0, 545, 545, 545.0, 545.0, 545.0, 545.0, 1.834862385321101, 0.33149369266055045, 1.265051605504587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 282.85714285714283, 166, 961, 169.0, 961.0, 961.0, 961.0, 0.042689434364994665, 7.352623780301876, 0.09444918242110079], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c5a1fd95-07a4-4c18-a231-579660e95025", 3, 0, 0.0, 934.6666666666666, 168, 2434, 202.0, 2434.0, 2434.0, 2434.0, 0.021359154177494573, 0.029445318340393718, 0.013697113844291765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 22, 0, 0.0, 226.18181818181816, 163, 487, 169.0, 332.9, 464.1999999999997, 487.0, 0.11833619312466717, 0.18339798680551447, 0.2661408718419028], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b1f27626-d552-4fc8-bb9a-72a013b1f6d1", 3, 0, 0.0, 257.0, 172, 407, 192.0, 407.0, 407.0, 407.0, 0.03185524974515801, 0.02655641100174142, 0.020428008462878015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b5ca9981-ee71-41bb-894d-a22a225bf2d5", 3, 0, 0.0, 317.3333333333333, 198, 455, 299.0, 455.0, 455.0, 455.0, 0.02073756610099195, 0.02451110107835344, 0.013298504303044967], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e401c83-9d76-4b26-a4ba-6b444ccd21b1", 3, 0, 0.0, 261.6666666666667, 174, 423, 188.0, 423.0, 423.0, 423.0, 0.030304866961634036, 0.025263920666909107, 0.01943378512839162], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 110.78571428571428, 83, 255, 86.5, 251.5, 255.0, 255.0, 0.0761436504353785, 0.06313081955042613, 0.027066688240700958], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 88.76470588235294, 84, 114, 85.0, 104.39999999999999, 114.0, 114.0, 0.09545788903301158, 0.0741103728332463, 0.033932296492203334], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/379b957d-5e62-4924-be41-3e3cc03ac785", 3, 0, 0.0, 541.3333333333333, 177, 1152, 295.0, 1152.0, 1152.0, 1152.0, 0.025703637064644645, 0.02577894068885747, 0.016483126633251938], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d6e4ba2b-db91-46d5-be14-4a216ca2115b", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=151f50a4-dce5-49d3-9378-4e7f6b1444d9", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 0.6716136152416357, 2.5630227695167282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 84.24999999999999, 81, 96, 83.0, 95.3, 96.0, 96.0, 0.09943075890526734, 0.07389336672549654, 0.04990958015362052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 102.4375, 80, 246, 82.0, 243.2, 246.0, 246.0, 0.09934124337983745, 0.04523228000571212, 0.05561266383544123], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 238.375, 79, 974, 86.0, 908.2, 974.0, 974.0, 0.09944064636420136, 11.208060616065879, 0.057392013673088875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 223.31250000000003, 81, 653, 239.0, 646.7, 653.0, 653.0, 0.09934124337983745, 3.6746316224908573, 0.057431656328968524], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4ac1aafa-19d3-47f6-a62c-a6d2bcdf374a", 2, 0, 0.0, 252.5, 207, 298, 252.5, 298.0, 298.0, 298.0, 0.03193612774451098, 0.02691492015968064, 0.019850923153692614], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 27.586206896551722, 0.5878030859662013], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.344827586206897, 0.2204261572373255], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.896551724137931, 0.14695077149155034], "isController": false}, {"data": ["401/Unauthorized", 16, 55.172413793103445, 1.1756061719324027], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1361, 29, "401/Unauthorized", 16, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
