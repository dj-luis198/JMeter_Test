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

    var data = {"OkPercent": 68.5805422647528, "KoPercent": 31.41945773524721};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.528235294117647, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bdd3a046-8094-4812-b828-199e533e59b9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=90285c4c-1d50-4dca-bcdb-cea39c0a5e94"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b2261c7a-177f-471e-8ca9-0e12cbf40254"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e6f22f9e-e8f3-4dd5-8b9d-19e1b00578cc"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8dedecf0-60ac-45ad-90a6-b91686c66ad1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e6f22f9e-e8f3-4dd5-8b9d-19e1b00578cc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=51123e3c-f278-4eab-919e-2c8256e62571"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=595cbd5f-6c02-4e13-8d72-f66c2b72e96e"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b2261c7a-177f-471e-8ca9-0e12cbf40254"], "isController": false}, {"data": [0.41304347826086957, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5ca10948-232c-4517-a974-22308acd148b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8c1b47d8-2145-4641-8b8c-176b6be54bbf"], "isController": false}, {"data": [0.38636363636363635, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/25b2252f-6e38-4aac-a51e-0c93bbc53451"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8dedecf0-60ac-45ad-90a6-b91686c66ad1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e83e8131-3a03-4615-8b03-dc54177797df"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/51123e3c-f278-4eab-919e-2c8256e62571"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/90285c4c-1d50-4dca-bcdb-cea39c0a5e94"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=81a1cf0b-8589-4e1d-b354-ed395876a0c3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/400dd883-80f6-4bc9-ac40-4b7e1321dbad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.95, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dbc5f7d0-3833-4e84-a7b2-fb87a0a0aad6"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/81a1cf0b-8589-4e1d-b354-ed395876a0c3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/13ab22c2-184e-48e7-9749-68cabc633471"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=400dd883-80f6-4bc9-ac40-4b7e1321dbad"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/88bbebcb-4cd4-4374-91a3-4b157cccb7b3"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=88bbebcb-4cd4-4374-91a3-4b157cccb7b3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8c1b47d8-2145-4641-8b8c-176b6be54bbf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=13ab22c2-184e-48e7-9749-68cabc633471"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=25b2252f-6e38-4aac-a51e-0c93bbc53451"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dcac51f4-6de4-4879-88a3-6f4d86f18ee2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5ca10948-232c-4517-a974-22308acd148b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dcac51f4-6de4-4879-88a3-6f4d86f18ee2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/595cbd5f-6c02-4e13-8d72-f66c2b72e96e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1c74b1f0-a790-4300-b20a-a68deb03074f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ed3d0519-08ab-42be-9cbe-21c9585133f7"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.41304347826086957, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 627, 197, 31.41945773524721, 242.70494417862855, 81, 2290, 89.0, 560.4000000000005, 1020.6000000000008, 1640.1200000000026, 2.4617679970160387, 2.6200570473998313, 1.178960680912464], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 60, 60, 100.0, 468.1500000000001, 334, 636, 504.5, 601.7, 621.95, 636.0, 0.2614390476646957, 1.682124534039364, 0.4388805888043085], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 106.41176470588235, 84, 251, 87.0, 247.0, 251.0, 251.0, 0.08573820595325755, 0.06656432981722632, 0.03047725289744702], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 16, 100.0, 85.6875, 84, 92, 85.0, 90.6, 92.0, 92.0, 0.09023336604292853, 0.04485232745688537, 0.04529292006451685], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bdd3a046-8094-4812-b828-199e533e59b9", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 1.6807154605263157, 3.1404194078947367], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=90285c4c-1d50-4dca-bcdb-cea39c0a5e94", 1, 0, 0.0, 1041.0, 1041, 1041, 1041.0, 1041.0, 1041.0, 1041.0, 0.9606147934678194, 0.17354857108549473, 0.6622988712776178], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b2261c7a-177f-471e-8ca9-0e12cbf40254", 1, 0, 0.0, 175.0, 175, 175, 175.0, 175.0, 175.0, 175.0, 5.714285714285714, 1.0323660714285714, 3.9397321428571432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 16, 100.0, 95.18749999999999, 82, 246, 84.0, 141.0000000000001, 246.0, 246.0, 0.08619575054949792, 0.04284534866181097, 0.043266226350040946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e6f22f9e-e8f3-4dd5-8b9d-19e1b00578cc", 3, 0, 0.0, 237.0, 179, 350, 182.0, 350.0, 350.0, 350.0, 0.024396987785241447, 0.024468463335393525, 0.015645203755509655], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8dedecf0-60ac-45ad-90a6-b91686c66ad1", 3, 0, 0.0, 325.3333333333333, 170, 504, 302.0, 504.0, 504.0, 504.0, 0.04826487764853516, 0.03102966580594302, 0.030951109689978603], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e6f22f9e-e8f3-4dd5-8b9d-19e1b00578cc", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=51123e3c-f278-4eab-919e-2c8256e62571", 1, 0, 0.0, 336.0, 336, 336, 336.0, 336.0, 336.0, 336.0, 2.976190476190476, 0.5376906622023809, 2.051943824404762], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=595cbd5f-6c02-4e13-8d72-f66c2b72e96e", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 0.4843540549597855, 1.848399798927614], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 89.0, 89, 89, 89.0, 89.0, 89.0, 89.0, 11.235955056179774, 3.31372893258427, 6.945663623595506], "isController": false}, {"data": ["https://demoqa.com/books", 60, 60, 100.0, 154.8, 82, 355, 86.5, 334.9, 341.9, 355.0, 0.25297349259420104, 0.12574561301801593, 0.12228699104895459], "isController": false}, {"data": ["deleteBook", 15, 1, 6.666666666666667, 452.1333333333334, 87, 732, 437.0, 685.2, 732.0, 732.0, 0.08304866097875616, 0.015636505699906433, 0.05618220287957391], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, 6.666666666666667, 452.1333333333334, 87, 732, 437.0, 685.2, 732.0, 732.0, 0.08560324607509118, 0.01611748617507576, 0.057910373044679185], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b2261c7a-177f-471e-8ca9-0e12cbf40254", 3, 0, 0.0, 397.6666666666667, 170, 570, 453.0, 570.0, 570.0, 570.0, 0.07446570854121677, 0.03369379390374066, 0.04775307481321518], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, 17.391304347826086, 925.6521739130434, 151, 1726, 896.0, 1427.4, 1667.3999999999992, 1726.0, 0.09273146580224814, 0.02949830765074911, 0.04183782929749867], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 87.66666666666666, 84, 92, 87.0, 92.0, 92.0, 92.0, 0.045350559827466316, 0.03569585080169712, 0.016120706813669665], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 601.9230769230769, 348, 2277, 461.0, 1644.9999999999995, 2277.0, 2277.0, 0.08272351256761057, 0.01494516584473433, 0.05630692212853961], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5ca10948-232c-4517-a974-22308acd148b", 1, 0, 0.0, 186.0, 186, 186, 186.0, 186.0, 186.0, 186.0, 5.376344086021506, 0.9713121639784946, 3.7067372311827955], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8c1b47d8-2145-4641-8b8c-176b6be54bbf", 1, 0, 0.0, 634.0, 634, 634, 634.0, 634.0, 634.0, 634.0, 1.5772870662460567, 0.28495908911671924, 1.0874654968454258], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1203.0909090909092, 677, 2290, 1129.5, 1985.3999999999996, 2263.2999999999997, 2290.0, 0.11014594337497183, 0.05700913084837409, 0.05066283137657396], "isController": false}, {"data": ["goToProfile", 15, 1, 6.666666666666667, 165.33333333333331, 82, 196, 170.0, 191.2, 196.0, 196.0, 0.0828944532558178, 0.16690064201754046, 0.05312044943990981], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 9, 100.0, 133.55555555555554, 83, 354, 86.0, 354.0, 354.0, 354.0, 0.046343736643992564, 0.023036095656047088, 0.02326238343262908], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25b2252f-6e38-4aac-a51e-0c93bbc53451", 3, 0, 0.0, 1180.6666666666665, 188, 2277, 1077.0, 2277.0, 2277.0, 2277.0, 0.019719976336028396, 0.023308344425820023, 0.012645948366528627], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8dedecf0-60ac-45ad-90a6-b91686c66ad1", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 0.45853822969543145, 1.7498810279187818], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e83e8131-3a03-4615-8b03-dc54177797df", 1, 0, 0.0, 823.0, 823, 823, 823.0, 823.0, 823.0, 823.0, 1.215066828675577, 0.38801450486026734, 0.7250056956257594], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/51123e3c-f278-4eab-919e-2c8256e62571", 3, 0, 0.0, 330.0, 161, 461, 368.0, 461.0, 461.0, 461.0, 0.04672460517708626, 0.037978951538797, 0.02996336985639971], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/90285c4c-1d50-4dca-bcdb-cea39c0a5e94", 3, 0, 0.0, 323.0, 160, 480, 329.0, 480.0, 480.0, 480.0, 0.016696256142830903, 0.023017136967737266, 0.01070690904992737], "isController": false}, {"data": ["addBook", 60, 60, 100.0, 569.9666666666667, 334, 1830, 508.0, 694.8, 1233.8499999999985, 1830.0, 0.27577711693409385, 0.9344059459270018, 0.5387259298285125], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=81a1cf0b-8589-4e1d-b354-ed395876a0c3", 1, 0, 0.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 396.0, 2.5252525252525255, 0.456222380050505, 1.7410432449494948], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/400dd883-80f6-4bc9-ac40-4b7e1321dbad", 3, 0, 0.0, 338.0, 160, 637, 217.0, 637.0, 637.0, 637.0, 0.026692291266282298, 0.026770491338351486, 0.01711712688625525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 111.125, 83, 311, 86.0, 270.40000000000003, 311.0, 311.0, 0.0859065015114175, 0.0641781969299164, 0.030537076709136694], "isController": false}, {"data": ["deleteBooks", 15, 1, 6.666666666666667, 392.66666666666663, 89, 1041, 373.0, 796.8000000000002, 1041.0, 1041.0, 0.08588015710343407, 0.016169623329630945, 0.05880218829796979], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 7, 3.888888888888889, 154.07222222222217, 83, 1348, 89.5, 260.9, 338.95, 1151.1699999999994, 0.734516993866783, 1.6533207628060997, 0.3510873274395146], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 90.72727272727273, 83, 112, 86.0, 109.80000000000001, 112.0, 112.0, 0.04781257470714798, 0.03702673021754722, 0.01699587616543151], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dbc5f7d0-3833-4e84-a7b2-fb87a0a0aad6", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 5.58659217877095, 1.783999650837989, 3.3334060754189947], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 14, 100.0, 133.35714285714286, 81, 265, 84.5, 260.5, 265.0, 265.0, 0.07009392586065327, 0.03484160963190676, 0.035183865129273226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 97.00000000000001, 84, 255, 87.0, 107.0, 255.0, 255.0, 0.1156625332529783, 0.09386285657541503, 0.04111441611726964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81a1cf0b-8589-4e1d-b354-ed395876a0c3", 3, 0, 0.0, 243.33333333333331, 167, 385, 178.0, 385.0, 385.0, 385.0, 0.04692926195914025, 0.03017099360979883, 0.03009461134749554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/13ab22c2-184e-48e7-9749-68cabc633471", 3, 0, 0.0, 344.66666666666663, 158, 697, 179.0, 697.0, 697.0, 697.0, 0.02459338929695698, 0.029068553560302992, 0.015771151339519937], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=400dd883-80f6-4bc9-ac40-4b7e1321dbad", 1, 0, 0.0, 378.0, 378, 378, 378.0, 378.0, 378.0, 378.0, 2.6455026455026456, 0.4779472552910053, 1.823950066137566], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 526.4545454545454, 125, 1511, 364.5, 1165.1, 1471.8499999999995, 1511.0, 0.11108810801803667, 0.06823673822592291, 0.050228314465186504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/88bbebcb-4cd4-4374-91a3-4b157cccb7b3", 2, 0, 0.0, 230.0, 172, 288, 230.0, 288.0, 288.0, 288.0, 0.06688963210702341, 0.03935644857859532, 0.04157739339464883], "isController": false}, {"data": ["login", 22, 3, 13.636363636363637, 2073.7272727272725, 981, 3963, 1987.0, 2939.9999999999995, 3834.749999999998, 3963.0, 0.10799348112077599, 0.15933448710459658, 0.1624216587062381], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 11, 100.0, 100.63636363636364, 83, 246, 84.0, 217.2000000000001, 246.0, 246.0, 0.04739254816806259, 0.023557428728070175, 0.023788837654672042], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=88bbebcb-4cd4-4374-91a3-4b157cccb7b3", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 0.7084865196078431, 2.703737745098039], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 138.37499999999997, 84, 256, 87.0, 255.3, 256.0, 256.0, 0.08839095318594142, 0.07155869159291546, 0.03142022164031511], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c1b47d8-2145-4641-8b8c-176b6be54bbf", 3, 0, 0.0, 374.3333333333333, 159, 531, 433.0, 531.0, 531.0, 531.0, 0.01888966546402463, 0.022326945084594218, 0.012113489897177254], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=13ab22c2-184e-48e7-9749-68cabc633471", 1, 0, 0.0, 325.0, 325, 325, 325.0, 325.0, 325.0, 325.0, 3.076923076923077, 0.555889423076923, 2.121394230769231], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=25b2252f-6e38-4aac-a51e-0c93bbc53451", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.3542432598039216, 1.3518688725490196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 17, 100.0, 123.58823529411765, 83, 262, 84.0, 252.39999999999998, 262.0, 262.0, 0.08239228420491446, 0.04095475845732564, 0.04135706453254495], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dcac51f4-6de4-4879-88a3-6f4d86f18ee2", 1, 0, 0.0, 356.0, 356, 356, 356.0, 356.0, 356.0, 356.0, 2.8089887640449436, 0.5074833216292135, 1.9366660814606742], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ca10948-232c-4517-a974-22308acd148b", 3, 0, 0.0, 461.6666666666667, 196, 840, 349.0, 840.0, 840.0, 840.0, 0.06844002372587489, 0.03176935997171145, 0.043888947506501796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dcac51f4-6de4-4879-88a3-6f4d86f18ee2", 3, 0, 0.0, 242.33333333333334, 179, 348, 200.0, 348.0, 348.0, 348.0, 0.031233732431025507, 0.02603827758979698, 0.02002944429984383], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/595cbd5f-6c02-4e13-8d72-f66c2b72e96e", 3, 0, 0.0, 286.3333333333333, 179, 353, 327.0, 353.0, 353.0, 353.0, 0.02432754608042687, 0.02439881818808437, 0.015600672453919573], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 88.21428571428571, 83, 96, 87.0, 96.0, 96.0, 96.0, 0.07132885659842872, 0.05913886645709569, 0.025355179493972712], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 18, 100.0, 87.55555555555556, 84, 120, 85.0, 92.10000000000005, 120.0, 120.0, 0.08315854638860913, 0.041335644640431685, 0.04174169223021981], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 96.77777777777777, 84, 254, 87.0, 110.90000000000023, 254.0, 254.0, 0.08017495957845788, 0.06224520787585353, 0.028499692662654952], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1c74b1f0-a790-4300-b20a-a68deb03074f", 1, 0, 0.0, 162.0, 162, 162, 162.0, 162.0, 162.0, 162.0, 6.172839506172839, 1.9712094907407407, 3.683207947530864], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ed3d0519-08ab-42be-9cbe-21c9585133f7", 1, 0, 0.0, 162.0, 162, 162, 162.0, 162.0, 162.0, 162.0, 6.172839506172839, 1.9712094907407407, 3.683207947530864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 19, 100.0, 111.10526315789474, 83, 252, 85.0, 249.0, 252.0, 252.0, 0.11676643026585873, 0.05804112598175986, 0.05861127456704237], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 4, 100.0, 162.0, 82, 399, 83.5, 399.0, 399.0, 399.0, 0.08628872206402623, 0.04289156204159116, 0.048453139830874105], "isController": false}, {"data": ["register", 23, 4, 17.391304347826086, 925.6521739130434, 151, 1726, 896.0, 1427.4, 1667.3999999999992, 1726.0, 0.09233165530585864, 0.029371126084896948, 0.04165744604619794], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 2.030456852791878, 0.6379585326953748], "isController": false}, {"data": ["401/Unauthorized", 9, 4.568527918781726, 1.4354066985645932], "isController": false}, {"data": ["404/Not Found", 184, 93.4010152284264, 29.34609250398724], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 627, 197, "404/Not Found", 184, "401/Unauthorized", 9, "406/Not Acceptable", 4, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 60, 60, "404/Not Found", 60, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 9, "404/Not Found", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 11, "404/Not Found", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 18, "404/Not Found", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 19, "404/Not Found", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 4, "404/Not Found", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
