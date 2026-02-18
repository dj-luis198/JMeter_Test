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

    var data = {"OkPercent": 70.47619047619048, "KoPercent": 29.523809523809526};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5472578763127188, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5408c5e4-8167-4655-88ca-c9bd81ea3463"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2cdb1682-f474-41d7-a30a-6d86bbe0e4ca"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8226297d-e754-4954-b398-ba7e2abed78c"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.44, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/768c9ad2-1600-456f-8576-d5993c0ea438"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59647787-a424-485b-9624-14ea7c0f5d9c"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.41304347826086957, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c4232c10-c1e4-4e63-9f34-813544fca6eb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7a347c1d-2b05-460d-b875-1e0dc1a1c097"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/59647787-a424-485b-9624-14ea7c0f5d9c"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ce01fc12-46a9-4e47-9236-2ed320a15d41"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d8a0d0f3-5215-4bc1-a21e-b39bc70abcbd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c4232c10-c1e4-4e63-9f34-813544fca6eb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fc721da2-f7c0-4e9b-a648-045842a786a1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4feee3c4-267e-4a7c-86da-28bf7fed7251"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/696fef0c-0379-4d68-921c-2747e8550792"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c8ea3d79-4c89-4a33-b204-ddff9863a686"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9725274725274725, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8ea3d79-4c89-4a33-b204-ddff9863a686"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d8a0d0f3-5215-4bc1-a21e-b39bc70abcbd"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/00ba07ef-0532-4fed-b3e8-57ff2853551d"], "isController": false}, {"data": [0.8260869565217391, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7a347c1d-2b05-460d-b875-1e0dc1a1c097"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2f3cb0a2-895c-4573-9b3a-e08b843cbd83"], "isController": false}, {"data": [0.13043478260869565, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b6ce0e4b-7f60-463b-8f00-0be477c9e050"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=00ba07ef-0532-4fed-b3e8-57ff2853551d"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9c57edb2-a376-454d-99dc-94a278ee9254"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=53cb3c7e-44ba-48ea-bf8f-ad97420b996a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ce01fc12-46a9-4e47-9236-2ed320a15d41"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b6ce0e4b-7f60-463b-8f00-0be477c9e050"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9331caa7-bbfb-448d-91bf-a3f3bc1008f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/31e7f3f2-6e4a-4eb2-8431-620d5eeff39f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9c57edb2-a376-454d-99dc-94a278ee9254"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/53cb3c7e-44ba-48ea-bf8f-ad97420b996a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2f3cb0a2-895c-4573-9b3a-e08b843cbd83"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9331caa7-bbfb-448d-91bf-a3f3bc1008f6"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5408c5e4-8167-4655-88ca-c9bd81ea3463"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2cdb1682-f474-41d7-a30a-6d86bbe0e4ca"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.44, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 630, 186, 29.523809523809526, 243.8857142857142, 84, 1867, 94.0, 599.5999999999999, 897.1999999999989, 1456.3299999999967, 2.443773807399592, 2.497591228161196, 1.1770472605974445], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/5408c5e4-8167-4655-88ca-c9bd81ea3463", 3, 0, 0.0, 407.3333333333333, 264, 482, 476.0, 482.0, 482.0, 482.0, 0.02320239448711107, 0.02327037025221003, 0.014879139693883076], "isController": false}, {"data": ["see books", 56, 56, 100.0, 502.9821428571427, 345, 1090, 519.5, 628.9, 715.3499999999999, 1090.0, 0.24881700841978985, 1.6025101429031614, 0.4176918334703308], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 123.79999999999998, 87, 260, 89.0, 256.4, 260.0, 260.0, 0.07394991126010649, 0.05741228462088346, 0.02628688251824098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 17, 100.0, 116.23529411764706, 85, 256, 86.0, 255.2, 256.0, 256.0, 0.08495115308697498, 0.042226696212178, 0.04264149676436049], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2cdb1682-f474-41d7-a30a-6d86bbe0e4ca", 1, 0, 0.0, 519.0, 519, 519, 519.0, 519.0, 519.0, 519.0, 1.9267822736030829, 0.3481003131021195, 1.3284260597302504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 16, 100.0, 108.375, 85, 265, 86.5, 258.0, 265.0, 265.0, 0.08250782535156069, 0.041012190531195696, 0.04141506077217011], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8226297d-e754-4954-b398-ba7e2abed78c", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 223.0, 4.484304932735426, 1.4319997197309418, 2.6756936659192823], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 90.0, 90, 90, 90.0, 90.0, 90.0, 90.0, 11.11111111111111, 3.2769097222222223, 6.868489583333334], "isController": false}, {"data": ["https://demoqa.com/books", 56, 56, 100.0, 174.21428571428572, 84, 536, 88.0, 350.0, 370.3499999999998, 536.0, 0.2459873316524199, 0.1222729998155095, 0.11890989176557408], "isController": false}, {"data": ["deleteBook", 15, 1, 6.666666666666667, 501.99999999999994, 90, 796, 480.0, 727.0, 796.0, 796.0, 0.08927136710171579, 0.01680812458711993, 0.06039184736679225], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, 6.666666666666667, 501.99999999999994, 90, 796, 480.0, 727.0, 796.0, 796.0, 0.0929114739476227, 0.017493488454200838, 0.06285437016860336], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 3, 12.0, 896.12, 241, 1474, 859.0, 1253.0000000000002, 1433.8, 1474.0, 0.10069966124633957, 0.03222389159882866, 0.04543285497637586], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/768c9ad2-1600-456f-8576-d5993c0ea438", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 1.252297794117647, 2.339920343137255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59647787-a424-485b-9624-14ea7c0f5d9c", 1, 0, 0.0, 374.0, 374, 374, 374.0, 374.0, 374.0, 374.0, 2.6737967914438503, 0.4830589906417112, 1.8434575534759359], "isController": false}, {"data": ["deleteAccount", 15, 1, 6.666666666666667, 440.0, 88, 951, 412.0, 746.4000000000001, 951.0, 951.0, 0.09504980609839556, 0.019177040956961447, 0.064158619116417], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 216.75, 93, 261, 256.5, 261.0, 261.0, 261.0, 0.03509541566132924, 0.027623930686554072, 0.012475323535863128], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1133.5217391304345, 609, 1867, 1042.0, 1713.2000000000003, 1846.3999999999996, 1867.0, 0.0971045943138927, 0.05025921385387025, 0.04466432023617526], "isController": false}, {"data": ["goToProfile", 15, 1, 6.666666666666667, 208.73333333333335, 95, 482, 178.0, 359.00000000000006, 482.0, 482.0, 0.08936231055190164, 0.17048653309979983, 0.05726518377359165], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 4, 100.0, 88.0, 86, 91, 87.5, 91.0, 91.0, 91.0, 0.034863552770345065, 0.01732963707041566, 0.017499869261677112], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c4232c10-c1e4-4e63-9f34-813544fca6eb", 3, 0, 0.0, 309.0, 230, 443, 254.0, 443.0, 443.0, 443.0, 0.06951202558042541, 0.031452381366143006, 0.044576396612447285], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7a347c1d-2b05-460d-b875-1e0dc1a1c097", 1, 0, 0.0, 386.0, 386, 386, 386.0, 386.0, 386.0, 386.0, 2.5906735751295336, 0.4680416126943005, 1.7861479922279793], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59647787-a424-485b-9624-14ea7c0f5d9c", 3, 0, 0.0, 265.6666666666667, 165, 417, 215.0, 417.0, 417.0, 417.0, 0.04259548487860287, 0.027662106879170804, 0.0273154639358228], "isController": false}, {"data": ["addBook", 63, 63, 100.0, 605.5238095238094, 424, 1927, 523.0, 906.6000000000001, 1082.3999999999999, 1927.0, 0.284637696874407, 0.9216972073314538, 0.5575346182127463], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ce01fc12-46a9-4e47-9236-2ed320a15d41", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d8a0d0f3-5215-4bc1-a21e-b39bc70abcbd", 3, 0, 0.0, 274.3333333333333, 186, 381, 256.0, 381.0, 381.0, 381.0, 0.020328370952113137, 0.02402744626533945, 0.013036097257702758], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c4232c10-c1e4-4e63-9f34-813544fca6eb", 1, 0, 0.0, 168.0, 168, 168, 168.0, 168.0, 168.0, 168.0, 5.952380952380952, 1.0753813244047619, 4.103887648809524], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc721da2-f7c0-4e9b-a648-045842a786a1", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 1.4192708333333333, 2.6519097222222223], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4feee3c4-267e-4a7c-86da-28bf7fed7251", 1, 0, 0.0, 182.0, 182, 182, 182.0, 182.0, 182.0, 182.0, 5.4945054945054945, 1.7545930631868132, 3.2784598214285716], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/696fef0c-0379-4d68-921c-2747e8550792", 1, 0, 0.0, 161.0, 161, 161, 161.0, 161.0, 161.0, 161.0, 6.211180124223602, 1.9834530279503104, 3.7060850155279503], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8ea3d79-4c89-4a33-b204-ddff9863a686", 3, 0, 0.0, 270.3333333333333, 167, 406, 238.0, 406.0, 406.0, 406.0, 0.05430159103661737, 0.034910690851991964, 0.034822309356164136], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 101.25, 87, 255, 88.5, 148.6000000000001, 255.0, 255.0, 0.08873360507999889, 0.06629024207636636, 0.03154202368078086], "isController": false}, {"data": ["deleteBooks", 15, 1, 6.666666666666667, 382.93333333333334, 90, 797, 374.0, 757.4, 797.0, 797.0, 0.09313877677739832, 0.017536285315119526, 0.0637721689692642], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 1, 0.5494505494505495, 172.76373626373626, 85, 1665, 96.0, 292.0, 470.0999999999996, 1007.6399999999901, 0.7452144538847374, 1.5697934793735286, 0.36157503966629134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 90.88888888888889, 88, 96, 90.0, 96.0, 96.0, 96.0, 0.0816778444309323, 0.06325247132200129, 0.02903392126255797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 18, 100.0, 93.00000000000001, 85, 181, 87.0, 106.30000000000013, 181.0, 181.0, 0.10194950101383116, 0.05067607032816412, 0.051173870626083216], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8ea3d79-4c89-4a33-b204-ddff9863a686", 1, 0, 0.0, 343.0, 343, 343, 343.0, 343.0, 343.0, 343.0, 2.9154518950437316, 0.5267173833819242, 2.0100674198250728], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 24, 0, 0.0, 113.45833333333331, 87, 342, 89.0, 257.0, 320.75, 342.0, 0.11100473157668345, 0.09008294134787495, 0.0394587131776492], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d8a0d0f3-5215-4bc1-a21e-b39bc70abcbd", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/00ba07ef-0532-4fed-b3e8-57ff2853551d", 3, 0, 0.0, 437.6666666666667, 178, 951, 184.0, 951.0, 951.0, 951.0, 0.02929029612489382, 0.02937610753932222, 0.018783165158216417], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 454.8695652173913, 122, 1137, 396.0, 858.6, 1081.7999999999993, 1137.0, 0.09667318159847003, 0.059382257056091466, 0.043710628007901986], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a347c1d-2b05-460d-b875-1e0dc1a1c097", 3, 0, 0.0, 259.0, 177, 374, 226.0, 374.0, 374.0, 374.0, 0.05485563824535098, 0.03526688982245058, 0.035177606557077294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2f3cb0a2-895c-4573-9b3a-e08b843cbd83", 3, 0, 0.0, 305.3333333333333, 258, 381, 277.0, 381.0, 381.0, 381.0, 0.14654877631771773, 0.06621409554980216, 0.09397821918811979], "isController": false}, {"data": ["login", 23, 3, 13.043478260869565, 1822.8260869565215, 1015, 3075, 1746.0, 2364.0, 2945.599999999998, 3075.0, 0.09764256876371773, 0.1439597723230016, 0.146874290234045], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b6ce0e4b-7f60-463b-8f00-0be477c9e050", 3, 0, 0.0, 309.3333333333333, 176, 470, 282.0, 470.0, 470.0, 470.0, 0.018935090509732636, 0.026103550881744046, 0.012142619890681411], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 9, 100.0, 86.77777777777777, 85, 88, 87.0, 88.0, 88.0, 88.0, 0.07450022763958446, 0.03703185143412938, 0.03739562207690079], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 110.29411764705883, 86, 260, 89.0, 258.4, 260.0, 260.0, 0.0843609656849366, 0.0682961333523559, 0.029987687020817312], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=00ba07ef-0532-4fed-b3e8-57ff2853551d", 1, 0, 0.0, 342.0, 342, 342, 342.0, 342.0, 342.0, 342.0, 2.923976608187134, 0.5282574926900584, 2.0159448099415203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 15, 100.0, 87.13333333333333, 84, 92, 87.0, 90.8, 92.0, 92.0, 0.07285691387827067, 0.03621500894925759, 0.03657075559905383], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9c57edb2-a376-454d-99dc-94a278ee9254", 1, 0, 0.0, 731.0, 731, 731, 731.0, 731.0, 731.0, 731.0, 1.3679890560875512, 0.24714646032831739, 0.9431643296853626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=53cb3c7e-44ba-48ea-bf8f-ad97420b996a", 1, 0, 0.0, 797.0, 797, 797, 797.0, 797.0, 797.0, 797.0, 1.2547051442910915, 0.22668012860727726, 0.865060382685069], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ce01fc12-46a9-4e47-9236-2ed320a15d41", 3, 0, 0.0, 252.33333333333331, 170, 412, 175.0, 412.0, 412.0, 412.0, 0.0536135535063264, 0.03481739558760454, 0.03438108737222103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b6ce0e4b-7f60-463b-8f00-0be477c9e050", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9331caa7-bbfb-448d-91bf-a3f3bc1008f6", 1, 0, 0.0, 173.0, 173, 173, 173.0, 173.0, 173.0, 173.0, 5.780346820809248, 1.0443009393063585, 3.9852781791907517], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/31e7f3f2-6e4a-4eb2-8431-620d5eeff39f", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 1.2425522859922178, 2.321710846303502], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9c57edb2-a376-454d-99dc-94a278ee9254", 3, 0, 0.0, 338.0, 182, 610, 222.0, 610.0, 610.0, 610.0, 0.03023187850815757, 0.030320448464724436, 0.019386979381858856], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/53cb3c7e-44ba-48ea-bf8f-ad97420b996a", 3, 0, 0.0, 263.6666666666667, 178, 382, 231.0, 382.0, 382.0, 382.0, 0.034860210555671754, 0.03496234007878407, 0.022355017836807732], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2f3cb0a2-895c-4573-9b3a-e08b843cbd83", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 0.889970751231527, 3.3963208128078817], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 106.72222222222223, 86, 303, 89.0, 198.60000000000016, 303.0, 303.0, 0.1044768322624458, 0.08662190487384422, 0.03713824896829128], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9331caa7-bbfb-448d-91bf-a3f3bc1008f6", 3, 0, 0.0, 478.0, 166, 890, 378.0, 890.0, 890.0, 890.0, 0.08368200836820085, 0.038790097629009763, 0.0536632670850767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 16, 100.0, 86.50000000000001, 85, 89, 87.0, 87.6, 89.0, 89.0, 0.08137068926059471, 0.04044695393910421, 0.04084427175775946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 112.0, 86, 448, 89.0, 201.60000000000025, 448.0, 448.0, 0.08426463308018833, 0.06542029619018529, 0.0299534437902232], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5408c5e4-8167-4655-88ca-c9bd81ea3463", 1, 0, 0.0, 371.0, 371, 371, 371.0, 371.0, 371.0, 371.0, 2.6954177897574128, 0.48696512803234504, 1.858364218328841], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2cdb1682-f474-41d7-a30a-6d86bbe0e4ca", 3, 0, 0.0, 288.6666666666667, 186, 431, 249.0, 431.0, 431.0, 431.0, 0.022962464025473025, 0.027140855103024924, 0.014725278037168575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 24, 24, 100.0, 101.45833333333333, 84, 256, 87.0, 176.0, 255.75, 256.0, 0.11047536629488637, 0.05491402484775114, 0.05545345534723789], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 5, 100.0, 88.8, 85, 95, 88.0, 95.0, 95.0, 95.0, 0.06740179558383436, 0.03350343159391766, 0.038308442411905855], "isController": false}, {"data": ["register", 25, 3, 12.0, 896.12, 241, 1474, 859.0, 1253.0000000000002, 1433.8, 1474.0, 0.10441203494879635, 0.033411851183614824, 0.04710777358041397], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 1.6129032258064515, 0.47619047619047616], "isController": false}, {"data": ["401/Unauthorized", 3, 1.6129032258064515, 0.47619047619047616], "isController": false}, {"data": ["404/Not Found", 180, 96.7741935483871, 28.571428571428573], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 630, 186, "404/Not Found", 180, "406/Not Acceptable", 3, "401/Unauthorized", 3, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 56, 56, "404/Not Found", 56, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 4, "404/Not Found", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 18, "404/Not Found", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 9, "404/Not Found", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 24, 24, "404/Not Found", 24, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 5, "404/Not Found", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
