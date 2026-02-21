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

    var data = {"OkPercent": 67.46411483253588, "KoPercent": 32.535885167464116};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5247641509433962, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b8c9bf93-d6cd-48cd-aaad-cbdd3f6cae92"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=428cba2b-9e2b-4df4-9406-c34c339d9189"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/67b1000a-d642-4fb8-9636-ca0c98cb3bb0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/58398df1-7f07-4dd0-a7c6-2fd8ee893dda"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=16e75372-f408-4f64-a52e-4a295976f5c0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.425, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/59b8c2e1-b6ec-4d01-bebd-295940738e9b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=58398df1-7f07-4dd0-a7c6-2fd8ee893dda"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b1806a2d-65c0-4f0e-9076-281e96ea03dd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/16e75372-f408-4f64-a52e-4a295976f5c0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.946236559139785, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b405aaf0-0298-4dc5-b808-2da99dadf773"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de50323f-a789-42a2-890c-e98ba9c90e58"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bc35b4c9-2226-47b6-ae5c-e26091b331ea"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4e12bd45-c608-4e7e-a9a0-10bf786ea96c"], "isController": false}, {"data": [0.05, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=009ce48a-332a-49b0-ab43-4d3fbbc4c1fe"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/87a11352-db85-463d-ab69-5ba11e31caa0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/884939e6-2dd4-4ec0-8665-d641bb4581a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b405aaf0-0298-4dc5-b808-2da99dadf773"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/009ce48a-332a-49b0-ab43-4d3fbbc4c1fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/81750f3d-ad45-4b95-9ddc-15f47ae9c24f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=884939e6-2dd4-4ec0-8665-d641bb4581a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=67b1000a-d642-4fb8-9636-ca0c98cb3bb0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4e12bd45-c608-4e7e-a9a0-10bf786ea96c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bc35b4c9-2226-47b6-ae5c-e26091b331ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/de50323f-a789-42a2-890c-e98ba9c90e58"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b8c9bf93-d6cd-48cd-aaad-cbdd3f6cae92"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7667cdf-31cb-4f85-bd8a-e07e1d53eac4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/428cba2b-9e2b-4df4-9406-c34c339d9189"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a7667cdf-31cb-4f85-bd8a-e07e1d53eac4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 627, 204, 32.535885167464116, 244.7655502392345, 98, 2993, 106.0, 492.00000000000045, 923.0000000000001, 1422.6800000000005, 2.4209615889539284, 2.5172347512239948, 1.1592145437240335], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/b8c9bf93-d6cd-48cd-aaad-cbdd3f6cae92", 3, 0, 0.0, 285.6666666666667, 193, 469, 195.0, 469.0, 469.0, 469.0, 0.03298298078191653, 0.02749655396565372, 0.02115119535819517], "isController": false}, {"data": ["see books", 58, 58, 100.0, 609.4655172413794, 400, 3303, 608.0, 736.7, 755.6499999999999, 3303.0, 0.2537205049912947, 1.6326507805186397, 0.42592338679690983], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 17, 100.0, 131.88235294117646, 99, 415, 102.0, 318.9999999999999, 415.0, 415.0, 0.0777932347342217, 0.03866870749972544, 0.03904855727870113], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 115.38888888888889, 101, 314, 103.5, 127.7000000000003, 314.0, 314.0, 0.09933500731216026, 0.07712044024723379, 0.03531049088049446], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=428cba2b-9e2b-4df4-9406-c34c339d9189", 1, 0, 0.0, 626.0, 626, 626, 626.0, 626.0, 626.0, 626.0, 1.5974440894568689, 0.2886007388178914, 1.1013628194888179], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 16, 100.0, 102.4375, 99, 120, 101.5, 108.10000000000001, 120.0, 120.0, 0.08413082343043432, 0.04181893469344831, 0.04222972972972973], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/67b1000a-d642-4fb8-9636-ca0c98cb3bb0", 3, 0, 0.0, 303.0, 242, 389, 278.0, 389.0, 389.0, 389.0, 0.03086578527702042, 0.030956212382324197, 0.019793488605380938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/58398df1-7f07-4dd0-a7c6-2fd8ee893dda", 3, 0, 0.0, 253.0, 179, 365, 215.0, 365.0, 365.0, 365.0, 0.03189351817398978, 0.025923865520980617, 0.020452549089440056], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 101.0, 101, 101, 101.0, 101.0, 101.0, 101.0, 9.900990099009901, 2.9200185643564356, 6.120436262376237], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=16e75372-f408-4f64-a52e-4a295976f5c0", 1, 0, 0.0, 722.0, 722, 722, 722.0, 722.0, 722.0, 722.0, 1.3850415512465375, 0.25022723337950137, 0.9549212257617729], "isController": false}, {"data": ["https://demoqa.com/books", 58, 58, 100.0, 227.08620689655172, 99, 2993, 101.5, 410.4, 422.34999999999997, 2993.0, 0.24847807181016274, 0.12351107280407504, 0.12011391166604547], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 487.42857142857144, 101, 1095, 431.0, 937.5, 1095.0, 1095.0, 0.0704955839552051, 0.013311352243773729, 0.04767401551658157], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 487.42857142857144, 101, 1095, 431.0, 937.5, 1095.0, 1095.0, 0.0714121757759698, 0.01348442800122421, 0.048293878637557706], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 861.8695652173914, 154, 1683, 914.0, 1369.4, 1628.1999999999991, 1683.0, 0.08921333235069373, 0.028106442172305852, 0.04025054643166064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 14, 0, 0.0, 133.35714285714286, 101, 310, 104.5, 304.5, 310.0, 310.0, 0.07097411979417506, 0.055864395072368254, 0.025229081645585665], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 420.9230769230769, 102, 849, 389.0, 730.9999999999999, 849.0, 849.0, 0.06960954400394097, 0.01427016568410118, 0.04692578484760864], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1099.8500000000001, 673, 2023, 986.0, 1839.1000000000001, 2014.3, 2023.0, 0.09553835865099838, 0.04944856453616127, 0.04394391301232445], "isController": false}, {"data": ["goToProfile", 16, 2, 12.5, 226.68750000000003, 99, 374, 192.5, 369.1, 374.0, 374.0, 0.07807353551125967, 0.15853445147241807, 0.04964417071266499], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 14, 14, 100.0, 101.71428571428572, 100, 105, 101.0, 105.0, 105.0, 105.0, 0.07147597896564048, 0.035528587200694337, 0.035877591004237507], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59b8c2e1-b6ec-4d01-bebd-295940738e9b", 1, 0, 0.0, 173.0, 173, 173, 173.0, 173.0, 173.0, 173.0, 5.780346820809248, 1.8458724710982661, 3.449015534682081], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=58398df1-7f07-4dd0-a7c6-2fd8ee893dda", 1, 0, 0.0, 359.0, 359, 359, 359.0, 359.0, 359.0, 359.0, 2.785515320334262, 0.5032425139275766, 1.920482242339833], "isController": false}, {"data": ["addBook", 64, 64, 100.0, 621.7812500000003, 409, 1164, 609.5, 782.5, 816.5, 1164.0, 0.30170605344911305, 0.9497691462543665, 0.5899693933351247], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b1806a2d-65c0-4f0e-9076-281e96ea03dd", 2, 0, 0.0, 262.0, 180, 344, 262.0, 344.0, 344.0, 344.0, 0.011396076330919264, 0.022536186103624522, 0.007083596274052844], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/16e75372-f408-4f64-a52e-4a295976f5c0", 3, 0, 0.0, 251.66666666666666, 189, 372, 194.0, 372.0, 372.0, 372.0, 0.016791107429505334, 0.023147897123683297, 0.01076773490759294], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 115.9375, 100, 302, 103.5, 169.70000000000013, 302.0, 302.0, 0.0815910249872514, 0.06095423253442121, 0.029003059663437022], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 502.1538461538462, 101, 1078, 380.0, 997.5999999999999, 1078.0, 1078.0, 0.06845275706643077, 0.012968588741101142, 0.04681958782225452], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 186, 9, 4.838709677419355, 175.4677419354839, 100, 846, 108.0, 319.7000000000002, 409.3, 839.04, 0.7582706537026845, 1.585085209900324, 0.3663796398214395], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 129.00000000000003, 100, 302, 104.5, 302.0, 302.0, 302.0, 0.0422072269324315, 0.032685870075603696, 0.015003350198637763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 17, 100.0, 113.35294117647058, 99, 298, 102.0, 144.39999999999986, 298.0, 298.0, 0.07999661190820152, 0.039763940880150964, 0.04015454933673398], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b405aaf0-0298-4dc5-b808-2da99dadf773", 3, 0, 0.0, 339.0, 238, 427, 352.0, 427.0, 427.0, 427.0, 0.07683638971416863, 0.0347664653980125, 0.049273335851859446], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 132.75, 100, 309, 106.0, 301.3, 309.0, 309.0, 0.15477480266212662, 0.12560337989475312, 0.05501760563380281], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de50323f-a789-42a2-890c-e98ba9c90e58", 1, 0, 0.0, 661.0, 661, 661, 661.0, 661.0, 661.0, 661.0, 1.5128593040847202, 0.27331930786686837, 1.0430455748865355], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bc35b4c9-2226-47b6-ae5c-e26091b331ea", 1, 0, 0.0, 1078.0, 1078, 1078, 1078.0, 1078.0, 1078.0, 1078.0, 0.9276437847866419, 0.1675918947124304, 0.6395669063079777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 399.74999999999994, 108, 738, 416.5, 681.5000000000002, 735.8, 738.0, 0.09702379508574478, 0.05959762412981784, 0.04386915734833968], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4e12bd45-c608-4e7e-a9a0-10bf786ea96c", 3, 0, 0.0, 320.6666666666667, 191, 554, 217.0, 554.0, 554.0, 554.0, 0.019723217514217153, 0.02717720694585977, 0.01264802685644785], "isController": false}, {"data": ["login", 20, 4, 20.0, 1802.5500000000002, 1272, 2595, 1730.5, 2492.0000000000005, 2590.5, 2595.0, 0.09329750709061053, 0.13870715311986864, 0.14011026016009853], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=009ce48a-332a-49b0-ab43-4d3fbbc4c1fe", 1, 0, 0.0, 592.0, 592, 592, 592.0, 592.0, 592.0, 592.0, 1.6891891891891893, 0.30517578125, 1.1646167652027029], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 8, 100.0, 102.50000000000001, 100, 107, 102.0, 107.0, 107.0, 107.0, 0.04357749440301557, 0.021661078760873947, 0.021873859495263673], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 139.52941176470588, 101, 307, 104.0, 306.2, 307.0, 307.0, 0.07991838922135983, 0.06469955533643292, 0.02840848991853025], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87a11352-db85-463d-ab69-5ba11e31caa0", 1, 0, 0.0, 1102.0, 1102, 1102, 1102.0, 1102.0, 1102.0, 1102.0, 0.9074410163339383, 0.28977852767695095, 0.5414516220508166], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/884939e6-2dd4-4ec0-8665-d641bb4581a8", 3, 0, 0.0, 338.0, 264, 393, 357.0, 393.0, 393.0, 393.0, 0.06260303416038898, 0.028326242670228083, 0.040145825942697354], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b405aaf0-0298-4dc5-b808-2da99dadf773", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 0.9264823717948718, 3.535657051282051], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 18, 100.0, 112.27777777777777, 98, 303, 101.0, 124.80000000000028, 303.0, 303.0, 0.09824791223186508, 0.04883612043556574, 0.049315846569510394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/009ce48a-332a-49b0-ab43-4d3fbbc4c1fe", 3, 0, 0.0, 278.0, 175, 375, 284.0, 375.0, 375.0, 375.0, 0.02542092820282511, 0.025495403578419326, 0.016301832213400216], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81750f3d-ad45-4b95-9ddc-15f47ae9c24f", 2, 0, 0.0, 287.5, 201, 374, 287.5, 374.0, 374.0, 374.0, 0.029869470414289556, 0.026398311254816453, 0.018566326092475882], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=884939e6-2dd4-4ec0-8665-d641bb4581a8", 1, 0, 0.0, 209.0, 209, 209, 209.0, 209.0, 209.0, 209.0, 4.784688995215311, 0.8644213516746412, 3.2988187799043063], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 150.35294117647055, 100, 489, 104.0, 348.1999999999999, 489.0, 489.0, 0.08064745675873128, 0.06686493241031528, 0.028667650644705257], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 16, 100.0, 102.62500000000001, 99, 112, 102.0, 107.10000000000001, 112.0, 112.0, 0.09152375613495178, 0.04549374206317427, 0.04594063540367696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=67b1000a-d642-4fb8-9636-ca0c98cb3bb0", 1, 0, 0.0, 367.0, 367, 367, 367.0, 367.0, 367.0, 367.0, 2.7247956403269753, 0.49227264986376024, 1.8786188692098094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4e12bd45-c608-4e7e-a9a0-10bf786ea96c", 1, 0, 0.0, 380.0, 380, 380, 380.0, 380.0, 380.0, 380.0, 2.631578947368421, 0.4754317434210526, 1.8143503289473684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 107.56249999999999, 101, 120, 105.0, 118.6, 120.0, 120.0, 0.09043482192818345, 0.07021062835244711, 0.03214675310728396], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bc35b4c9-2226-47b6-ae5c-e26091b331ea", 3, 0, 0.0, 501.6666666666667, 192, 925, 388.0, 925.0, 925.0, 925.0, 0.038913534127169434, 0.03244061227203155, 0.02495431713233196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de50323f-a789-42a2-890c-e98ba9c90e58", 3, 0, 0.0, 411.3333333333333, 367, 490, 377.0, 490.0, 490.0, 490.0, 0.05763688760806916, 0.03705496517771374, 0.036961155139289145], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b8c9bf93-d6cd-48cd-aaad-cbdd3f6cae92", 1, 0, 0.0, 361.0, 361, 361, 361.0, 361.0, 361.0, 361.0, 2.770083102493075, 0.5004544667590027, 1.9098424515235457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 16, 100.0, 126.0, 99, 300, 102.0, 295.8, 300.0, 300.0, 0.15286721571474976, 0.07598575468633559, 0.07673217663806776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 7, 100.0, 101.42857142857143, 98, 108, 101.0, 108.0, 108.0, 108.0, 0.05677302146020211, 0.02822018351879187, 0.0321565941864426], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7667cdf-31cb-4f85-bd8a-e07e1d53eac4", 1, 0, 0.0, 877.0, 877, 877, 877.0, 877.0, 877.0, 877.0, 1.1402508551881414, 0.20600235176738882, 0.7861495153933865], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/428cba2b-9e2b-4df4-9406-c34c339d9189", 3, 0, 0.0, 340.6666666666667, 279, 412, 331.0, 412.0, 412.0, 412.0, 0.03666764447051921, 0.030568306474283758, 0.023514081903295198], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 861.8695652173914, 154, 1683, 914.0, 1369.4, 1628.1999999999991, 1683.0, 0.0895331817757155, 0.02820720995141852, 0.04039485349646539], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a7667cdf-31cb-4f85-bd8a-e07e1d53eac4", 3, 0, 0.0, 402.0, 174, 849, 183.0, 849.0, 849.0, 849.0, 0.02521940885705639, 0.02975102138605871, 0.016172602685026394], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 2.9411764705882355, 0.9569377990430622], "isController": false}, {"data": ["401/Unauthorized", 11, 5.392156862745098, 1.7543859649122806], "isController": false}, {"data": ["404/Not Found", 187, 91.66666666666667, 29.82456140350877], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 627, 204, "404/Not Found", 187, "401/Unauthorized", 11, "406/Not Acceptable", 6, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books", 58, 58, "404/Not Found", 58, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 186, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 8, "404/Not Found", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 18, "404/Not Found", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 7, "404/Not Found", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
