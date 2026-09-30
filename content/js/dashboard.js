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

    var data = {"OkPercent": 98.67291178766588, "KoPercent": 1.327088212334114};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7764745308310992, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.07142857142857142, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7b7523a0-1f60-46d3-b620-8799b8c64854"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=38137ac2-8b3e-43ea-b2df-def9dfa35c85"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=018502a3-0cc9-48b8-8584-ce63dcc81fd8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0bba1e54-9c37-4b2d-9fd7-92f3a4a98331"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d6f7d9e8-c3ab-43ae-9ba3-83dda3341842"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a022990e-249f-4762-913b-8892ec8950f7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2873d1a9-769a-4905-b71b-ccae78289e92"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f1a9b5d7-cb07-4f79-b4f7-94d2dd7d1677"], "isController": false}, {"data": [0.6190476190476191, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8d928e85-fde2-4660-8012-3d36b3e40d99"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/14a2e04f-1aa1-4713-93cc-708d96c16032"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d6f7d9e8-c3ab-43ae-9ba3-83dda3341842"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=84ea53d4-21d1-4586-9fe8-0b360135ba0b"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f99f2c0d-3ae6-4a28-8c52-cd75999f94f9"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/018502a3-0cc9-48b8-8584-ce63dcc81fd8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2873d1a9-769a-4905-b71b-ccae78289e92"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4107142857142857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0bba1e54-9c37-4b2d-9fd7-92f3a4a98331"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f1a9b5d7-cb07-4f79-b4f7-94d2dd7d1677"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/38137ac2-8b3e-43ea-b2df-def9dfa35c85"], "isController": false}, {"data": [0.3125, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a022990e-249f-4762-913b-8892ec8950f7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fce23c43-43c4-4885-b2e8-84d52d89463e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e1899896-f1a8-4bdb-877c-b6860d452a86"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9494047619047619, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d5da24b3-581f-464b-8159-5b1828a2b2bb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=14a2e04f-1aa1-4713-93cc-708d96c16032"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/87fe21d7-2982-45ea-991c-48051fa364c4"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fce23c43-43c4-4885-b2e8-84d52d89463e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8d928e85-fde2-4660-8012-3d36b3e40d99"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7b7523a0-1f60-46d3-b620-8799b8c64854"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/84ea53d4-21d1-4586-9fe8-0b360135ba0b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f99f2c0d-3ae6-4a28-8c52-cd75999f94f9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1281, 17, 1.327088212334114, 386.04605776736946, 99, 2503, 126.0, 1064.5999999999997, 1295.7999999999997, 1768.4200000000012, 5.09623570786356, 717.2158696608378, 3.726207434397403], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1750.517857142857, 1442, 2235, 1751.0, 2056.2000000000003, 2200.5, 2235.0, 0.25620730831346966, 308.30348388324495, 1.259769333357734], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7b7523a0-1f60-46d3-b620-8799b8c64854", 3, 0, 0.0, 399.0, 223, 618, 356.0, 618.0, 618.0, 618.0, 0.021998328127062344, 0.02600127911112089, 0.014107000784607037], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=38137ac2-8b3e-43ea-b2df-def9dfa35c85", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 610.7142857142859, 110, 1082, 519.5, 967.0, 1082.0, 1082.0, 0.10516194940207921, 0.019857240306321737, 0.07111782222748032], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 610.7142857142859, 110, 1082, 519.5, 967.0, 1082.0, 1082.0, 0.10599155095922354, 0.020013890098117892, 0.07167885648365459], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 160.23529411764707, 105, 330, 111.0, 327.6, 330.0, 330.0, 0.08375704544558749, 0.02241155317587009, 0.04776768998068661], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 162.11764705882356, 105, 340, 113.0, 330.4, 340.0, 340.0, 0.08375663278628756, 0.06224491948277816, 0.042041903566554496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 147.47058823529412, 104, 324, 111.0, 320.8, 324.0, 324.0, 0.08375745810895367, 0.022575252380928917, 0.049322018788768615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 147.88235294117646, 104, 335, 110.0, 332.6, 335.0, 335.0, 0.08375869612345047, 0.02257558606452376, 0.04924095221320037], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=018502a3-0cc9-48b8-8584-ce63dcc81fd8", 1, 0, 0.0, 596.0, 596, 596, 596.0, 596.0, 596.0, 596.0, 1.6778523489932886, 0.3031276216442953, 1.1568005453020134], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0bba1e54-9c37-4b2d-9fd7-92f3a4a98331", 3, 0, 0.0, 350.3333333333333, 210, 466, 375.0, 466.0, 466.0, 466.0, 0.03905233012236397, 0.031971552818276495, 0.0250433236787295], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 316.2857142857143, 108, 530, 300.5, 528.0, 530.0, 530.0, 0.10598192251207436, 0.2298320304811579, 0.06850826422428802], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d6f7d9e8-c3ab-43ae-9ba3-83dda3341842", 1, 0, 0.0, 758.0, 758, 758, 758.0, 758.0, 758.0, 758.0, 1.3192612137203166, 0.23834309036939313, 0.9095687664907651], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a022990e-249f-4762-913b-8892ec8950f7", 1, 0, 0.0, 1495.0, 1495, 1495, 1495.0, 1495.0, 1495.0, 1495.0, 0.6688963210702341, 0.12084552675585283, 0.46117265886287623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 113.52631578947367, 105, 168, 111.0, 115.0, 168.0, 168.0, 0.08988338813066206, 0.0667981038744471, 0.04511724755777373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 165.52631578947373, 104, 339, 111.0, 325.0, 339.0, 339.0, 0.08988678995349542, 0.02405173871802514, 0.05126355989535285], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 710.0, 516, 865, 668.0, 865.0, 865.0, 865.0, 0.05828185103158876, 17.136799342872127, 0.03323886816645297], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1058.8, 864, 1198, 1116.0, 1198.0, 1198.0, 1198.0, 0.05810642773303583, 52.284265814390636, 0.03308207750816395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 200.0, 108, 338, 112.0, 338.0, 338.0, 338.0, 0.058794478022624115, 0.10403866618847157, 0.032555145545730343], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 111.54545454545455, 109, 114, 112.0, 114.0, 114.0, 114.0, 0.06237489580557178, 0.04635478096488293, 0.031309273871156146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 204.90909090909093, 99, 331, 111.0, 330.2, 331.0, 331.0, 0.062299649989239154, 0.025176492076617242, 0.035054614846572955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 332.45454545454544, 108, 1260, 323.0, 1074.6000000000008, 1260.0, 1260.0, 0.062377018038299495, 5.117734184945023, 0.03618354366674795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 227.27272727272728, 104, 755, 110.0, 673.0000000000002, 755.0, 755.0, 0.06230247284178571, 1.6806291169190861, 0.03620114388756103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 153.4, 106, 324, 113.0, 324.0, 324.0, 324.0, 0.05879655217018074, 0.04369548457178471, 0.03301564208774797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 122.05263157894737, 104, 317, 112.0, 119.0, 317.0, 317.0, 0.08988423856223064, 0.024226611174976227, 0.05284210118599887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 680.7368421052632, 105, 1429, 875.0, 1357.0, 1429.0, 1429.0, 0.117001557968114, 55.42452081319162, 0.0634921077830668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 160.63157894736838, 102, 442, 111.0, 329.0, 442.0, 442.0, 0.08988678995349542, 0.024227298854653058, 0.0529313811933181], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 504.1052631578949, 109, 1003, 635.0, 971.0, 1003.0, 1003.0, 0.11699939652942842, 18.121099378671627, 0.06360519207914085], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2873d1a9-769a-4905-b71b-ccae78289e92", 3, 0, 0.0, 819.6666666666666, 207, 1802, 450.0, 1802.0, 1802.0, 1802.0, 0.015603788599872048, 0.02151108226577413, 0.010006335788329407], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 632.0714285714286, 113, 1495, 487.5, 1475.0, 1495.0, 1495.0, 0.10520383242532406, 0.01986514888220928, 0.07199740512868684], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 485.09090909090907, 225, 1373, 438.0, 1189.6000000000008, 1373.0, 1373.0, 0.06225945211682137, 6.858986320607879, 0.13857481569787186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f1a9b5d7-cb07-4f79-b4f7-94d2dd7d1677", 3, 0, 0.0, 489.3333333333333, 407, 576, 485.0, 576.0, 576.0, 576.0, 0.025157865606681932, 0.025231570291076505, 0.01613313647303496], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 799.6190476190476, 118, 1736, 809.0, 1564.8000000000002, 1726.4999999999998, 1736.0, 0.08984995058252718, 0.055191034098056244, 0.040625514765341875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 110.8421052631579, 100, 120, 111.0, 118.0, 120.0, 120.0, 0.11699219231053422, 0.08694439291827788, 0.05872459653087363], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8d928e85-fde2-4660-8012-3d36b3e40d99", 3, 0, 0.0, 436.3333333333333, 296, 526, 487.0, 526.0, 526.0, 526.0, 0.02815130387455779, 0.023468583731361493, 0.018052756716431917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 162.73684210526315, 103, 451, 110.0, 338.0, 451.0, 451.0, 0.11699723517060044, 0.12379240764915608, 0.06155343848716417], "isController": false}, {"data": ["login", 21, 0, 0.0, 2907.571428571429, 1460, 4891, 2887.0, 4438.2, 4849.499999999999, 4891.0, 0.09000745776078589, 25.761918320107238, 0.17133813632058084], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 116.78947368421052, 107, 143, 115.0, 131.0, 143.0, 143.0, 0.08694816516490406, 0.070390653243853, 0.03090735558596199], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/14a2e04f-1aa1-4713-93cc-708d96c16032", 3, 0, 0.0, 504.33333333333337, 215, 1004, 294.0, 1004.0, 1004.0, 1004.0, 0.044960659423004874, 0.02890537186212065, 0.028832193705507683], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d6f7d9e8-c3ab-43ae-9ba3-83dda3341842", 3, 0, 0.0, 465.66666666666663, 204, 793, 400.0, 793.0, 793.0, 793.0, 0.04066969429946452, 0.02614669474005287, 0.026080500576154002], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 798.7368421052631, 215, 1533, 1033.0, 1477.0, 1533.0, 1533.0, 0.116911565630461, 73.69997295458602, 0.24719320905326247], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=84ea53d4-21d1-4586-9fe8-0b360135ba0b", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 350.4117647058824, 214, 670, 228.0, 665.2, 670.0, 670.0, 0.08370961626527085, 0.129733555676743, 0.18826488892472537], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 896.8571428571429, 107, 1522, 1099.0, 1522.0, 1522.0, 1522.0, 0.08124891184493065, 69.43617245081539, 0.14624350734141953], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f99f2c0d-3ae6-4a28-8c52-cd75999f94f9", 1, 0, 0.0, 1455.0, 1455, 1455, 1455.0, 1455.0, 1455.0, 1455.0, 0.6872852233676976, 0.12416774054982817, 0.4738509450171821], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1193.6521739130435, 148, 2070, 1059.0, 1976.6, 2051.3999999999996, 2070.0, 0.09392508861627927, 0.029590869460461623, 0.04237635834054787], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 322.36842105263156, 213, 555, 231.0, 491.0, 555.0, 555.0, 0.08983494011792018, 0.1392266112960345, 0.2020408858316115], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 119.75000000000001, 106, 159, 116.5, 150.60000000000002, 159.0, 159.0, 0.08905975167172576, 0.06914306892482613, 0.031657958602058764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 447.82352941176464, 217, 1435, 229.0, 1332.6, 1435.0, 1435.0, 0.10179396900673038, 14.466374355180116, 0.2258729113524227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/018502a3-0cc9-48b8-8584-ce63dcc81fd8", 3, 0, 0.0, 372.33333333333337, 211, 657, 249.0, 657.0, 657.0, 657.0, 0.029675351652917088, 0.02473911965596376, 0.019030092043049045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 112.6, 110, 117, 112.5, 116.9, 117.0, 117.0, 0.05588808968920633, 0.041534019778794944, 0.028053201269777398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 132.6, 106, 330, 111.0, 308.5000000000001, 330.0, 330.0, 0.05582132709623038, 0.01493656603942102, 0.031835600609568894], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2873d1a9-769a-4905-b71b-ccae78289e92", 1, 0, 0.0, 571.0, 571, 571, 571.0, 571.0, 571.0, 571.0, 1.7513134851138354, 0.3163994089316988, 1.207448555166375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 130.39999999999998, 100, 322, 110.5, 301.20000000000005, 322.0, 322.0, 0.055823820024004246, 0.015046263990844895, 0.032818300443799374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 152.5, 105, 342, 110.0, 338.90000000000003, 342.0, 342.0, 0.05589152572686929, 0.015064512793570238, 0.032912685559865415], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 113.0, 113, 113, 113.0, 113.0, 113.0, 113.0, 8.849557522123893, 2.609928097345133, 5.470478429203539], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1186.4285714285718, 860, 1765, 1102.5, 1614.6000000000001, 1703.3999999999999, 1765.0, 0.2504001931658633, 299.56568421852785, 0.4944425689271246], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1193.6521739130435, 148, 2070, 1059.0, 1976.6, 2051.3999999999996, 2070.0, 0.09479063633366304, 0.029863558151994728, 0.042766869127101884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 109.57142857142857, 105, 113, 110.0, 113.0, 113.0, 113.0, 0.037415347775657574, 0.010084605455157707, 0.022032670613985856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 108.42857142857143, 104, 113, 108.0, 113.0, 113.0, 113.0, 0.03741514778983377, 0.010084551552728633, 0.021996014618632743], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 234.75, 107, 1161, 112.0, 913.5000000000009, 1161.0, 1161.0, 0.08687028095296699, 6.535299026057465, 0.05044810586591572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 187.08333333333334, 104, 630, 112.0, 538.8000000000003, 630.0, 630.0, 0.08688789289619069, 2.1504612072710683, 0.05054318509293384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 109.28571428571428, 105, 112, 110.0, 112.0, 112.0, 112.0, 0.03741434786791666, 0.010011261050594888, 0.02133787026842122], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 131.41666666666669, 108, 332, 112.5, 271.4000000000002, 332.0, 332.0, 0.08687342541916428, 0.06456120775779689, 0.04360638736860394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 111.57142857142857, 106, 116, 112.0, 116.0, 116.0, 116.0, 0.03741414789278174, 0.027804850142975495, 0.01878014845399396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 145.66666666666666, 107, 326, 112.0, 323.3, 326.0, 326.0, 0.08701390047060018, 0.03417391631438122, 0.049016131108194534], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 181.14285714285714, 114, 347, 119.0, 347.0, 347.0, 347.0, 0.037973310187696646, 0.02988914844851904, 0.013498325105782793], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 633.1538461538461, 107, 1518, 576.0, 1312.3999999999999, 1518.0, 1518.0, 0.10291405093453874, 0.01928092270363128, 0.0700421650741377], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1503.2857142857142, 764, 2503, 1438.0, 2186.6, 2472.2, 2503.0, 0.08746173549072281, 0.04526828106453427, 0.04022898185168989], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 224.28571428571428, 220, 229, 224.0, 229.0, 229.0, 229.0, 0.03739176419685161, 0.057949931426175307, 0.08409495404819264], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0bba1e54-9c37-4b2d-9fd7-92f3a4a98331", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f1a9b5d7-cb07-4f79-b4f7-94d2dd7d1677", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/38137ac2-8b3e-43ea-b2df-def9dfa35c85", 3, 0, 0.0, 778.6666666666667, 288, 1518, 530.0, 1518.0, 1518.0, 1518.0, 0.03205504920450053, 0.02624298461891889, 0.020556135069292332], "isController": false}, {"data": ["addBook", 56, 7, 12.5, 1121.5892857142856, 576, 2077, 945.5, 1907.7, 1999.5, 2077.0, 0.26627486222653335, 80.64370833511643, 0.9691236689228706], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a022990e-249f-4762-913b-8892ec8950f7", 2, 0, 0.0, 279.0, 236, 322, 279.0, 322.0, 322.0, 322.0, 0.038786750446047624, 0.034279305814133895, 0.02410914712784113], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fce23c43-43c4-4885-b2e8-84d52d89463e", 1, 0, 0.0, 595.0, 595, 595, 595.0, 595.0, 595.0, 595.0, 1.680672268907563, 0.3036370798319328, 1.1587447478991597], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 188.21428571428572, 106, 455, 114.0, 449.3, 452.45, 455.0, 0.2513893752076207, 0.18682354934863218, 0.12152123117946508], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 688.517857142857, 515, 1002, 649.5, 886.6, 908.65, 1002.0, 0.2513047653666133, 73.89194512132187, 0.12638862711309165], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e1899896-f1a8-4bdb-877c-b6860d452a86", 1, 0, 0.0, 341.0, 341, 341, 341.0, 341.0, 341.0, 341.0, 2.932551319648094, 0.9364690249266862, 1.7497938049853372], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 187.0, 105, 465, 113.5, 348.30000000000007, 456.75, 465.0, 0.2517996933439449, 0.4455674261125275, 0.1224572727395357], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 994.3392857142857, 750, 1314, 972.0, 1218.1000000000001, 1276.1499999999999, 1314.0, 0.2509297844692387, 225.78706115293275, 0.12595498946991085], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 141.58823529411762, 108, 336, 116.0, 336.0, 336.0, 336.0, 0.09489943451101672, 0.07089655019621853, 0.03373378336133797], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 7, 4.166666666666667, 177.37499999999994, 104, 1241, 118.0, 326.1, 380.34999999999934, 778.0100000000016, 0.7108493380215539, 1.5333143191713527, 0.3404789492864004], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 139.1, 106, 346, 116.5, 324.1000000000001, 346.0, 346.0, 0.05565108992659621, 0.0430969866326082, 0.019782223372344747], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 116.4705882352941, 108, 129, 115.0, 125.8, 129.0, 129.0, 0.08163657318478679, 0.06624999249663849, 0.029019250624279676], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d5da24b3-581f-464b-8159-5b1828a2b2bb", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.6912033279220778, 1.291514475108225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 289.7, 219, 455, 226.5, 454.2, 455.0, 455.0, 0.05578520464802325, 0.08645617165665323, 0.12546223271913823], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=14a2e04f-1aa1-4713-93cc-708d96c16032", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.3763834635416667, 1.4363606770833335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87fe21d7-2982-45ea-991c-48051fa364c4", 1, 0, 0.0, 309.0, 309, 309, 309.0, 309.0, 309.0, 309.0, 3.236245954692557, 1.0334496359223302, 1.931002224919094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 403.33333333333337, 220, 1269, 237.5, 1086.3000000000006, 1269.0, 1269.0, 0.0866619965479638, 8.762939775780138, 0.19305708768749685], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fce23c43-43c4-4885-b2e8-84d52d89463e", 3, 0, 0.0, 371.0, 232, 485, 396.0, 485.0, 485.0, 485.0, 0.02050104555332322, 0.02423154179821504, 0.013146829342463131], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8d928e85-fde2-4660-8012-3d36b3e40d99", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7b7523a0-1f60-46d3-b620-8799b8c64854", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 118.90909090909089, 109, 137, 114.0, 136.0, 137.0, 137.0, 0.06336296031750605, 0.05253432940386975, 0.022523552300363472], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/84ea53d4-21d1-4586-9fe8-0b360135ba0b", 3, 0, 0.0, 326.3333333333333, 204, 453, 322.0, 453.0, 453.0, 453.0, 0.035431675918270934, 0.029537930347230422, 0.02272148488248494], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 161.84210526315795, 106, 344, 115.0, 340.0, 344.0, 344.0, 0.11486678475778223, 0.08917880261956726, 0.0408315523943679], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f99f2c0d-3ae6-4a28-8c52-cd75999f94f9", 3, 0, 0.0, 490.0, 352, 617, 501.0, 617.0, 617.0, 617.0, 0.016674077367718986, 0.022986561735771457, 0.010692686332814585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 124.6470588235294, 105, 335, 112.0, 158.99999999999983, 335.0, 335.0, 0.10186289254663224, 0.07570084104295619, 0.051130397235321264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 174.1764705882353, 103, 335, 112.0, 334.2, 335.0, 335.0, 0.10186411327289395, 0.04525603469971058, 0.05708790723175284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 281.6470588235294, 104, 1323, 111.0, 1219.8, 1323.0, 1323.0, 0.10186777562723585, 10.807850316539131, 0.05885719710815361], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 242.52941176470594, 107, 947, 112.0, 902.1999999999999, 947.0, 947.0, 0.1018647236469968, 3.5479445795982936, 0.05895491100318777], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 35.294117647058826, 0.468384074941452], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.882352941176471, 0.078064012490242], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.882352941176471, 0.078064012490242], "isController": false}, {"data": ["401/Unauthorized", 9, 52.94117647058823, 0.702576112412178], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1281, 17, "401/Unauthorized", 9, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
