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

    var data = {"OkPercent": 64.86486486486487, "KoPercent": 35.13513513513514};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.495906432748538, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6685e4a5-5171-43ca-ad71-ce04f5c32b9c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b07d51b-bc71-4dd5-b821-9939e7cc3ede"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=93c97db3-e198-4877-9a06-34b09ed4d53e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b9e74421-b265-4e25-8cdd-054fef7d6714"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7b3ec595-9076-441b-9775-f276a333d755"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4b07d51b-bc71-4dd5-b821-9939e7cc3ede"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/93c97db3-e198-4877-9a06-34b09ed4d53e"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/61d693ba-797f-41c1-a25e-4fea09b65f53"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6685e4a5-5171-43ca-ad71-ce04f5c32b9c"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b9e74421-b265-4e25-8cdd-054fef7d6714"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d6fa4f9d-b6ab-4683-bdc3-30e6f5b35065"], "isController": false}, {"data": [0.43478260869565216, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d7d7a37c-d602-4369-b711-90e05c7d3ad5"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/47386918-5cd1-4b5a-a477-64567ce66925"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.903954802259887, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dcef6999-4135-4661-8d77-f4aa4edb0ff2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=54bef497-e909-44c0-add9-612501b4bcf8"], "isController": false}, {"data": [0.7391304347826086, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7817817c-a563-424f-aa90-8cd329921200"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e610bc4-d75d-4084-a266-9aacefe78474"], "isController": false}, {"data": [0.06521739130434782, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=47386918-5cd1-4b5a-a477-64567ce66925"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d7d7a37c-d602-4369-b711-90e05c7d3ad5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7e610bc4-d75d-4084-a266-9aacefe78474"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eeafc363-554d-4e6d-81f0-a0bb19096e99"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eeafc363-554d-4e6d-81f0-a0bb19096e99"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/54bef497-e909-44c0-add9-612501b4bcf8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7b3ec595-9076-441b-9775-f276a333d755"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6804b393-7fd0-4d75-b58b-49c4944dc03b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c6b3debc-bdba-42e2-b8e3-2f50d227cbe9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dcef6999-4135-4661-8d77-f4aa4edb0ff2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6804b393-7fd0-4d75-b58b-49c4944dc03b"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 629, 221, 35.13513513513514, 233.106518282989, 82, 1886, 91.0, 566.0, 935.0, 1532.2000000000003, 2.4911285723338192, 2.6371859603716494, 1.1894216888584372], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 61, 61, 100.0, 468.65573770491807, 336, 636, 504.0, 605.6, 615.9, 636.0, 0.2719390143325235, 1.751003576165214, 0.4565069976929764], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 16, 100.0, 97.43750000000001, 84, 248, 85.5, 143.0000000000001, 248.0, 248.0, 0.0907873533216823, 0.04512769808665653, 0.04557099571029756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 98.64285714285715, 83, 247, 86.5, 170.0, 247.0, 247.0, 0.08436987754314917, 0.06550200453789412, 0.029990854907916305], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6685e4a5-5171-43ca-ad71-ce04f5c32b9c", 1, 0, 0.0, 352.0, 352, 352, 352.0, 352.0, 352.0, 352.0, 2.840909090909091, 0.5132501775568182, 1.9586736505681819], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b07d51b-bc71-4dd5-b821-9939e7cc3ede", 1, 0, 0.0, 158.0, 158, 158, 158.0, 158.0, 158.0, 158.0, 6.329113924050633, 1.1434434335443038, 4.363627373417722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 17, 100.0, 105.76470588235294, 83, 258, 85.0, 249.2, 258.0, 258.0, 0.08042273976620637, 0.03997575638769437, 0.04036844554670905], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=93c97db3-e198-4877-9a06-34b09ed4d53e", 1, 0, 0.0, 362.0, 362, 362, 362.0, 362.0, 362.0, 362.0, 2.7624309392265194, 0.4990719958563536, 1.9045666436464088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b9e74421-b265-4e25-8cdd-054fef7d6714", 3, 0, 0.0, 302.3333333333333, 162, 450, 295.0, 450.0, 450.0, 450.0, 0.0194908977507504, 0.026869776033342428, 0.012499045758130952], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 94.66666666666667, 90, 104, 90.0, 104.0, 104.0, 104.0, 0.026994682047636616, 0.00796132224451783, 0.01668714232046287], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7b3ec595-9076-441b-9775-f276a333d755", 3, 0, 0.0, 523.0, 224, 1066, 279.0, 1066.0, 1066.0, 1066.0, 0.039789909279006844, 0.03317121017693246, 0.02551631552071728], "isController": false}, {"data": ["https://demoqa.com/books", 61, 61, 100.0, 162.26229508196727, 82, 360, 88.0, 335.6, 347.9, 360.0, 0.2757249079033607, 0.1370546661355572, 0.13328498966031593], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b07d51b-bc71-4dd5-b821-9939e7cc3ede", 3, 0, 0.0, 268.0, 171, 446, 187.0, 446.0, 446.0, 446.0, 0.09603687816121391, 0.04345418640758051, 0.0615861490812472], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/93c97db3-e198-4877-9a06-34b09ed4d53e", 3, 0, 0.0, 270.3333333333333, 166, 440, 205.0, 440.0, 440.0, 440.0, 0.07969820944689442, 0.03606136430051538, 0.05110855228202539], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 384.9333333333334, 83, 716, 396.0, 663.2, 716.0, 716.0, 0.0857873274959823, 0.017459061572424522, 0.05748756262474907], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 384.9333333333334, 83, 716, 396.0, 663.2, 716.0, 716.0, 0.08528881636180652, 0.017357606767383283, 0.057153501745577776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/61d693ba-797f-41c1-a25e-4fea09b65f53", 1, 0, 0.0, 387.0, 387, 387, 387.0, 387.0, 387.0, 387.0, 2.5839793281653747, 0.8251574612403101, 1.5418079780361758], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6685e4a5-5171-43ca-ad71-ce04f5c32b9c", 3, 0, 0.0, 274.0, 173, 463, 186.0, 463.0, 463.0, 463.0, 0.020970808634380944, 0.028909952658399504, 0.013448077151604964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 885.6666666666665, 289, 1886, 793.5, 1549.0, 1802.25, 1886.0, 0.09539178199798087, 0.029809931874369023, 0.04303808914362028], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b9e74421-b265-4e25-8cdd-054fef7d6714", 1, 0, 0.0, 374.0, 374, 374, 374.0, 374.0, 374.0, 374.0, 2.6737967914438503, 0.4830589906417112, 1.8434575534759359], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 149.0, 84, 257, 89.0, 257.0, 257.0, 257.0, 0.043279972733617174, 0.03406607228837446, 0.015384677807652982], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 400.53333333333336, 86, 1066, 409.0, 755.8000000000002, 1066.0, 1066.0, 0.084373470730843, 0.0205825126841451, 0.0559962995201962], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d6fa4f9d-b6ab-4683-bdc3-30e6f5b35065", 1, 0, 0.0, 178.0, 178, 178, 178.0, 178.0, 178.0, 178.0, 5.617977528089887, 1.794022120786517, 3.352133075842697], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1162.4347826086957, 793, 1575, 1137.0, 1544.8, 1570.3999999999999, 1575.0, 0.10497873039636317, 0.054334694443430157, 0.04828611525067095], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 188.6, 83, 343, 187.0, 305.20000000000005, 343.0, 343.0, 0.0861608450655684, 0.14784774696570224, 0.054237578837173235], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 8, 100.0, 84.375, 83, 87, 84.0, 87.0, 87.0, 87.0, 0.045064329330118745, 0.02240014026272504, 0.02262018093328226], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d7d7a37c-d602-4369-b711-90e05c7d3ad5", 3, 0, 0.0, 267.3333333333333, 221, 341, 240.0, 341.0, 341.0, 341.0, 0.04128989636236013, 0.02568521873322598, 0.026478221300081206], "isController": false}, {"data": ["addBook", 58, 58, 100.0, 582.0172413793103, 340, 1965, 520.5, 750.6, 1135.1999999999982, 1965.0, 0.2695467896047886, 0.9084541912783025, 0.525437425351805], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/47386918-5cd1-4b5a-a477-64567ce66925", 3, 0, 0.0, 253.66666666666669, 167, 401, 193.0, 401.0, 401.0, 401.0, 0.02087842493162316, 0.02504459501075239, 0.013388833696385945], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 87.88235294117646, 83, 94, 88.0, 92.4, 94.0, 94.0, 0.07822277847309136, 0.05843791555851064, 0.027805753285356696], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 349.53333333333336, 90, 749, 362.0, 684.8000000000001, 749.0, 749.0, 0.08528154279996361, 0.017356126483898844, 0.05758169794130356], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 14, 7.909604519774011, 157.89265536723167, 83, 1528, 91.0, 295.80000000000007, 352.0, 1496.02, 0.7288569710845556, 1.665813448903832, 0.3456609654369436], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 104.9, 85, 253, 89.0, 236.80000000000007, 253.0, 253.0, 0.05687214572918622, 0.044042589417231125, 0.020216270552171664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 18, 100.0, 107.94444444444446, 83, 310, 86.0, 256.9000000000001, 310.0, 310.0, 0.08511362669163333, 0.04230745701761852, 0.04272305089794876], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 23, 0, 0.0, 120.7826086956522, 84, 342, 87.0, 268.0, 327.9999999999998, 342.0, 0.12647647537558013, 0.1026386240596749, 0.04495843460616325], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dcef6999-4135-4661-8d77-f4aa4edb0ff2", 1, 0, 0.0, 213.0, 213, 213, 213.0, 213.0, 213.0, 213.0, 4.694835680751174, 0.8481880868544601, 3.236869131455399], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=54bef497-e909-44c0-add9-612501b4bcf8", 1, 0, 0.0, 317.0, 317, 317, 317.0, 317.0, 317.0, 317.0, 3.1545741324921135, 0.5699181782334385, 2.1749309936908516], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 500.3913043478261, 176, 924, 539.0, 858.4000000000002, 921.1999999999999, 924.0, 0.10323808497840976, 0.06341480024552709, 0.0466789388134802], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7817817c-a563-424f-aa90-8cd329921200", 1, 0, 0.0, 276.0, 276, 276, 276.0, 276.0, 276.0, 276.0, 3.6231884057971016, 1.1570142663043477, 2.1618829257246377], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e610bc4-d75d-4084-a266-9aacefe78474", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["login", 23, 7, 30.434782608695652, 1876.9130434782605, 1267, 2420, 1915.0, 2318.6, 2400.9999999999995, 2420.0, 0.1057466402453322, 0.15917671068178996, 0.15841791388315454], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 10, 100.0, 85.8, 83, 94, 84.5, 93.4, 94.0, 94.0, 0.057349643571965196, 0.02850680525208036, 0.028786832808584094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 92.875, 85, 138, 89.0, 114.20000000000002, 138.0, 138.0, 0.0882495697833473, 0.07144423178749504, 0.031369964258924236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=47386918-5cd1-4b5a-a477-64567ce66925", 1, 0, 0.0, 642.0, 642, 642, 642.0, 642.0, 642.0, 642.0, 1.557632398753894, 0.2814081970404984, 1.0739145249221183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d7d7a37c-d602-4369-b711-90e05c7d3ad5", 1, 0, 0.0, 749.0, 749, 749, 749.0, 749.0, 749.0, 749.0, 1.335113484646195, 0.24120702603471295, 0.9204981642189586], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e610bc4-d75d-4084-a266-9aacefe78474", 3, 0, 0.0, 307.3333333333333, 217, 449, 256.0, 449.0, 449.0, 449.0, 0.03490645071209159, 0.029100071703667504, 0.022384670541282695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 14, 100.0, 97.0, 83, 249, 85.0, 170.0, 249.0, 249.0, 0.08054170046541596, 0.04003488821962571, 0.0404281582414295], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eeafc363-554d-4e6d-81f0-a0bb19096e99", 3, 0, 0.0, 253.66666666666669, 159, 409, 193.0, 409.0, 409.0, 409.0, 0.03153811381054004, 0.026292027821872732, 0.020224636786055947], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eeafc363-554d-4e6d-81f0-a0bb19096e99", 1, 0, 0.0, 503.0, 503, 503, 503.0, 503.0, 503.0, 503.0, 1.9880715705765406, 0.3591730864811133, 1.3706821570576542], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54bef497-e909-44c0-add9-612501b4bcf8", 3, 0, 0.0, 299.3333333333333, 177, 378, 343.0, 378.0, 378.0, 378.0, 0.0931098696461825, 0.043160304158907516, 0.05970912864680323], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7b3ec595-9076-441b-9775-f276a333d755", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 0.4856560819892473, 1.8533686155913978], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 110.2777777777778, 82, 318, 87.5, 257.7000000000001, 318.0, 318.0, 0.08364623220194059, 0.06935122181586675, 0.02973362160303357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 13, 100.0, 86.15384615384616, 83, 93, 85.0, 91.4, 93.0, 93.0, 0.05946880632382137, 0.029560178143383867, 0.0298505531742619], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6804b393-7fd0-4d75-b58b-49c4944dc03b", 3, 0, 0.0, 387.0, 280, 538, 343.0, 538.0, 538.0, 538.0, 0.021309996519367234, 0.02518769445371824, 0.013665590215870264], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c6b3debc-bdba-42e2-b8e3-2f50d227cbe9", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 1.4715941820276497, 2.749675979262673], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dcef6999-4135-4661-8d77-f4aa4edb0ff2", 3, 0, 0.0, 396.6666666666667, 181, 549, 460.0, 549.0, 549.0, 549.0, 0.0684931506849315, 0.030991367009132423, 0.04392301655251142], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 93.30769230769232, 86, 117, 91.0, 111.0, 117.0, 117.0, 0.061344482299757454, 0.04762584319170622, 0.021806046442491907], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 13, 100.0, 99.61538461538461, 83, 247, 88.0, 187.79999999999995, 247.0, 247.0, 0.07125552230297848, 0.03541900473849223, 0.040573682320956796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 23, 23, 100.0, 113.5217391304348, 82, 262, 84.0, 249.8, 259.79999999999995, 262.0, 0.13359743028247145, 0.06640731641970504, 0.06705964762225618], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6804b393-7fd0-4d75-b58b-49c4944dc03b", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.3988169150110375, 1.5219715783664458], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 885.6666666666665, 289, 1886, 793.5, 1549.0, 1802.25, 1886.0, 0.0961449866398529, 0.030045308324954032, 0.04337791389415238], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 3.6199095022624435, 1.2718600953895072], "isController": false}, {"data": ["401/Unauthorized", 20, 9.049773755656108, 3.179650238473768], "isController": false}, {"data": ["404/Not Found", 193, 87.33031674208145, 30.68362480127186], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 629, 221, "404/Not Found", 193, "401/Unauthorized", 20, "406/Not Acceptable", 8, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books", 61, 61, "404/Not Found", 61, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 8, "404/Not Found", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 18, "404/Not Found", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 10, "404/Not Found", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 13, "404/Not Found", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 13, "404/Not Found", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 23, 23, "404/Not Found", 23, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
